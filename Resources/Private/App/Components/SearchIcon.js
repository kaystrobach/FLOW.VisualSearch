import {LitElement, html, css} from 'lit';

export class SearchIcon extends LitElement {
    static styles = css`
        :host {
            display: flex;
            min-width: 14px;
            min-height: 14px;
            width: 14px;
            height: 14px;
            align-items: center;
            justify-content: center;
            transform: scale(calc(14/24));
        }

        .search {
            box-sizing: border-box;
            position: relative;
            display: block;
            width: 16px;
            height: 16px;
            border: 2px solid;
            border-radius: 100%;
            margin-left: -4px;
            margin-top: -4px;
            max-width: 100%;
            max-height: 100%;
        }

        .search::after {
            content: "";
            display: block;
            box-sizing: border-box;
            position: absolute;
            border-radius: 3px;
            width: 2px;
            height: 8px;
            background: currentcolor;
            transform: rotate(-45deg);
            top: 10px;
            left: 12px;
        }

        .sort,
        .sort::after,
        .sort::before {
            display: block;
            box-sizing: border-box;
            height: 2px;
            border-radius: 4px;
            background: currentcolor;
        }

        .sort {
            position: relative;
            width: 8px;
        }

        .sort::after,
        .sort::before {
            content: "";
            position: absolute;
        }

        .sort::before {
            width: 12px;
            top: -4px;
            left: -2px;
        }

        .sort::after {
            width: 4px;
            top: 4px;
            left: 2px;
        }

        .clear {
            min-width: 10px;
            min-height: 12px;
        }

        .clear {
            box-sizing: border-box;
            position: relative;
            display: block;
            width: 10px;
            height: 12px;
            border: 2px solid transparent;
            box-shadow:
                    0 0 0 2px,
                    inset -2px 0 0,
                    inset 2px 0 0;
            border-bottom-left-radius: 1px;
            border-bottom-right-radius: 1px;
            margin-top: 4px;
        }

        .clear::after,
        .clear::before {
            content: "";
            display: block;
            box-sizing: border-box;
            position: absolute;
        }

        .clear::after {
            background: currentcolor;
            border-radius: 3px;
            width: 16px;
            height: 2px;
            top: -4px;
            left: -5px;
            min-width: 16px;
            min-height: 2px;
        }

        .clear::before {
            width: 10px;
            height: 4px;
            border: 2px solid;
            border-bottom: transparent;
            border-top-left-radius: 2px;
            border-top-right-radius: 2px;
            top: -7px;
            left: -2px;
            min-width: 10px;
            min-height: 4px;
        }
    `;

    static get properties() {
        return {
            icon: {type: String},
        };
    }

    constructor() {
        super();

        this.icon = 'close';
    }

    render() {
        return html`
            <i class="${this.icon}"></i>
        `;
    }
}

customElements.define('search-icon', SearchIcon);
