import {LitElement, html, css} from 'lit';

export class SearchIcon extends LitElement {
    static styles = css`
        :host {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 14px;
            min-width: 14px;
            height: 14px;
            min-height: 14px;
            transform: scale(calc(14/24));
        }

        .search {
            position: relative;
            box-sizing: border-box;
            display: block;
            width: 16px;
            max-width: 100%;
            height: 16px;
            max-height: 100%;
            margin-top: -4px;
            margin-left: -4px;
            border: 2px solid;
            border-radius: 100%;
        }

        .search::after {
            position: absolute;
            top: 10px;
            left: 12px;
            box-sizing: border-box;
            display: block;
            width: 2px;
            height: 8px;
            content: "";
            background: currentcolor;
            border-radius: 3px;
            transform: rotate(-45deg);
        }

        .sort,
        .sort::after,
        .sort::before {
            box-sizing: border-box;
            display: block;
            height: 2px;
            background: currentcolor;
            border-radius: 4px;
        }

        .sort {
            position: relative;
            width: 8px;
        }

        .sort::after,
        .sort::before {
            position: absolute;
            content: "";
        }

        .sort::before {
            top: -4px;
            left: -2px;
            width: 12px;
        }

        .sort::after {
            top: 4px;
            left: 2px;
            width: 4px;
        }

        .clear {
            position: relative;
            box-sizing: border-box;
            display: block;
            width: 10px;
            height: 12px;
            margin-top: 4px;
            border: 2px solid transparent;
            border-bottom-right-radius: 1px;
            border-bottom-left-radius: 1px;
            box-shadow:
                    0 0 0 2px,
                    inset -2px 0 0,
                    inset 2px 0 0;
        }

        .clear::after,
        .clear::before {
            position: absolute;
            box-sizing: border-box;
            display: block;
            content: "";
        }

        .clear::after {
            top: -4px;
            left: -5px;
            width: 16px;
            min-width: 16px;
            height: 2px;
            min-height: 2px;
            background: currentcolor;
            border-radius: 3px;
        }

        .clear::before {
            top: -7px;
            left: -2px;
            width: 10px;
            min-width: 10px;
            height: 4px;
            min-height: 4px;
            border: 2px solid;
            border-bottom: transparent;
            border-top-left-radius: 2px;
            border-top-right-radius: 2px;
        }

        .enter {
            position: relative;
            box-sizing: border-box;
            display: block;
            width: 22px;
            height: 22px;
        }

        .enter::after,
        .enter::before {
            position: absolute;
            left: 3px;
            box-sizing: border-box;
            display: block;
            content: "";
        }

        .enter::after {
            bottom: 3px;
            width: 8px;
            height: 8px;
            border-bottom: 2px solid;
            border-left: 2px solid;
            transform: rotate(45deg);
        }

        .enter::before {
            bottom: 6px;
            width: 16px;
            height: 12px;
            border-right: 2px solid;
            border-bottom: 2px solid;
            border-bottom-right-radius: 4px;
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
