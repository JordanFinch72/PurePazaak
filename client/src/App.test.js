import { render, screen } from '@testing-library/react';
import ReactDOM from "react-dom";
import {act} from "react-dom/test-utils";
import App from './App';

/* Test variables */
let rootContainer;

// Set up tests
beforeEach(() => {
	rootContainer = document.createElement("div");
	document.body.appendChild(rootContainer);
});

// Tear down tests
afterEach(() => {
	document.body.appendChild(rootContainer);
	rootContainer = null;
});

describe("This is the first test", () => {
	it("Is going to let me test the testing library", () => {
		act(() => {
			ReactDOM.render(<App />, rootContainer);
		});
		const header = rootContainer.querySelector(".header-container header h1");
		expect(header.textContent).toEqual("Pure Pazaak");
	});
});

test('renders learn react link', () => {
  render(<App />);
    const header = screen.getAllByText("Pure Pazaak");
	expect(header).toBeInTheDocument();
	expect(header.textContent).toEqual("Pure Pazaak");
});
