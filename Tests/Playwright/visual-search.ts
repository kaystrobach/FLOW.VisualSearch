import { expect, type Locator, type Page } from "@playwright/test";

/**
 * <visual-search> web component of KayStrobach.VisualSearch.
 *
 * Typing completes facets (or values of the last facet) asynchronously, the query is stored in the
 * session and the page is reloaded on submit. The helpers wait for the events dispatched by the
 * component to avoid acting on outdated suggestions:
 *
 * - VisualSearchRequestUpdateAutocomplete: suggestions changed
 * - VisualSearchRequestUpdateSelectedFacets: a facet or value was added or removed
 * - search: the search button was clicked (Enter submits without this event)
 */
export class VisualSearch {
  public readonly page: Page;
  public readonly root: Locator;
  public readonly input: Locator;
  public readonly dropdown: Locator;
  public readonly suggestions: Locator;
  public readonly facets: Locator;

  constructor(page: Page, root?: Locator) {
    this.page = page;
    this.root = root ?? this.page.locator("visual-search");
    this.input = this.root.locator("input.vs-search__input");
    this.dropdown = this.root.locator("ul.vs-search__dropdown");
    this.suggestions = this.dropdown.locator(".vs-search__dropdown-item");
    this.facets = this.root.locator("ul.vs-search__facets search-facet");
  }

  suggestion(label: string | RegExp): Locator {
    return this.suggestions.filter({
      hasText: typeof label === "string" ? new RegExp(`^\\s*${escapeRegExp(label)}\\s*$`) : label
    });
  }

  // <search-facet> keeps facet and value in attributes, e.g. expect(facet).toHaveAttribute("value-label", "sl-e1")
  facet(label: string): Locator {
    return this.root.locator(
      `ul.vs-search__facets search-facet[facet-label="${label}"]`
    );
  }

  /**
   * Runs the action and waits until the component dispatched the event.
   * Gives up silently after a few seconds, the following assertions report the actual problem.
   */
  async withEvent(name: string, action: () => Promise<void>) {
    await this.root.evaluate((element, eventName) => {
      (element as any).__playwrightEvent = Promise.race([
        new Promise((resolve) =>
          element.addEventListener(eventName, resolve, { once: true })
        ),
        new Promise((resolve) => setTimeout(resolve, 5_000))
      ]);
    }, name);
    await action();
    await this.root.evaluate(
      async (element) => void (await (element as any).__playwrightEvent)
    );
  }

  // focusing the empty input loads the suggestions for an empty term
  async focus() {
    const focused = await this.input.evaluate(
      (input) => (input.getRootNode() as Document | ShadowRoot).activeElement === input
    );
    if (focused) {
      return;
    }
    await this.withEvent("VisualSearchRequestUpdateAutocomplete", () =>
      this.input.click()
    );
  }

  // removes all facets, the query is kept in the session between page loads
  async clear() {
    await this.focus();
    while ((await this.facets.count()) > 0) {
      await this.input.fill("");
      await this.withEvent("VisualSearchRequestUpdateSelectedFacets", () =>
        this.input.press("Backspace")
      );
    }
  }

  /**
   * Types the term until the expected suggestion is shown, a pending request
   * for an older term may overwrite the suggestions otherwise.
   */
  async type(term: string, expectedSuggestion: string | RegExp = term) {
    await this.focus();
    await expect(async () => {
      await this.input.fill(term);
      await expect(this.suggestion(expectedSuggestion).first()).toBeVisible({
        timeout: 2_000
      });
    }).toPass();
  }

  async chooseSuggestion(label: string | RegExp) {
    await this.withEvent("VisualSearchRequestUpdateSelectedFacets", () =>
      this.suggestion(label).first().click()
    );
  }

  // adds a free text facet by choosing the suggestion 'Text "<term>"'
  async addText(term: string) {
    const textSuggestion = new RegExp(`"${escapeRegExp(term)}"\\s*$`);
    await this.type(term, textSuggestion);
    await this.chooseSuggestion(textSuggestion);
  }

  /**
   * Adds a facet with a value, e.g. addFacet("Anmeldename", "sl-e1").
   * The value is chosen from the suggestions, facets without suggestions take the typed value.
   */
  async addFacet(facet: string, value: string) {
    await this.type(facet);
    await this.chooseSuggestion(facet);
    // the values for an empty term are loaded after choosing the facet and may overwrite
    // the values for the typed term, so type it a second time before giving up
    for (let attempt = 0; attempt < 2; attempt++) {
      await this.input.fill(value);
      const found = await this.suggestion(value)
        .first()
        .waitFor({ timeout: 2_000 })
        .then(
          () => true,
          () => false
        );
      if (found) {
        await this.chooseSuggestion(value);
        return;
      }
    }
    // Enter would choose the first suggestion, so only free values without suggestions are entered
    await expect(
      this.suggestions,
      `no suggestion "${value}" for facet "${facet}"`
    ).toHaveCount(0);
    await this.withEvent("VisualSearchRequestUpdateSelectedFacets", () =>
      this.input.press("Enter")
    );
  }

  // stores the query and waits for the reload of the page
  async submit() {
    await this.input.fill("");
    await Promise.all([this.page.waitForEvent("load"), this.input.press("Enter")]);
  }

  // replaces the current query with a free text search
  async search(term: string) {
    await this.clear();
    await this.addText(term);
    await this.submit();
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
