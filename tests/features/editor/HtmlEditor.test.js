/**
 * `__mocks__/react-dom.js` remplace TOUT react-dom par un mock automatique,
 * et jest l'applique d'office à chaque test puisqu'il est adjacent aux
 * node_modules. Le mock ne visait que `createPortal`, mais il neutralise aussi
 * `render` : c'est la raison pour laquelle `enzyme.mount` ne fonctionne nulle
 * part dans ce dépôt et que tous les tests existants se limitent à `shallow`.
 * On s'en désinscrit ici sans toucher au mock, dont d'autres tests dépendent.
 */
jest.unmock("react-dom");

import React from "react";
import ReactDOM from "react-dom";
import HtmlEditor from "../../../src/features/editor/HtmlEditor";

/**
 * Montage réel du composant.
 *
 * Vérifie le contrat vis-à-vis des formulaires appelants : ce que le champ
 * rend, ce qu'il émet, et surtout ce qu'il n'émet PAS.
 *
 * Rendu par react-dom plutôt que par enzyme : `mount` ne fonctionne pas dans ce
 * dépôt, y compris sur un simple `<div>`. Tous les autres tests du dépôt
 * utilisent `shallow`, qui ne monterait pas ProseMirror.
 *
 * Pas d'`act` non plus : `react-dom/test-utils` reste accroché au mock, et le
 * rendu React 16 d'un composant classe est de toute façon synchrone —
 * componentDidMount s'exécute avant le retour de ReactDOM.render.
 */
let container = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  if (container) {
    ReactDOM.unmountComponentAtNode(container);
    container.parentNode.removeChild(container);
    container = null;
  }
});

function render(props) {
  const ref = React.createRef();
  ReactDOM.render(<HtmlEditor ref={ref} name="body" {...props} />, container);
  return ref.current;
}

const rerender = render;

function unmount() {
  ReactDOM.unmountComponentAtNode(container);
}

const q = (selector) => container.querySelector(selector);
const qa = (selector) =>
  Array.prototype.slice.call(container.querySelectorAll(selector));

describe("HtmlEditor — rendu", () => {
  it("rend le libellé et l'astérisque de champ obligatoire", () => {
    render({ label: "Contenu", required: true });
    expect(q("label").textContent).toBe("Contenu *");
  });

  it("affiche la barre d'outils par défaut", () => {
    render({});
    expect(q(".rbf-editor-toolbar")).not.toBeNull();
  });

  it("n'affiche pas la barre quand le champ est désactivé", () => {
    render({ disabled: true });
    expect(q(".rbf-editor-toolbar")).toBeNull();
  });

  it("rend le contenu initial dans l'éditeur", () => {
    render({ value: "<p>Bonjour</p>" });
    expect(q(".rbf-editor-content").textContent).toContain("Bonjour");
  });

  it("affiche l'erreur de validation", () => {
    render({ error: "Champ obligatoire" });
    expect(q(".invalid-feedback").textContent).toBe("Champ obligatoire");
  });

  it('tous les boutons de la barre sont type="button" et ne soumettent donc pas le formulaire', () => {
    render({});
    const buttons = qa(".rbf-editor-toolbar button");
    expect(buttons.length).toBeGreaterThan(10);
    buttons.forEach((button) => {
      expect(button.getAttribute("type")).toBe("button");
    });
  });

  it("donne une infobulle à chaque bouton, même sans traduction fournie", () => {
    render({});
    qa(".rbf-editor-toolbar button").forEach((button) => {
      expect(button.getAttribute("title")).toBeTruthy();
    });
  });

  it("respecte le preset de barre demandé", () => {
    render({ toolbarPreset: "minimal" });
    expect(qa(".rbf-editor-toolbar button").length).toBeLessThan(5);
  });
});

describe("HtmlEditor — ce qu'il n'émet pas", () => {
  it("n'émet rien au montage, même avec un contenu à convertir", () => {
    const onChange = jest.fn();
    /* Le point le plus important du composant : ouvrir puis fermer un
       formulaire ne doit pas réécrire la base avec la conversion TipTap. */
    render({ value: "<p><cite>ancien format</cite></p>", onChange });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("n'émet rien quand le formulaire renvoie la même valeur", () => {
    const onChange = jest.fn();
    render({ value: "<p>a</p>", onChange });
    rerender({ value: "<p>a</p>", onChange });
    expect(onChange).not.toHaveBeenCalled();
  });

  it("n'émet rien au blur ni au démontage quand rien n'a été saisi, même avec un contenu à convertir", () => {
    const onChange = jest.fn();
    /* Le texte d'origine n'est pas au format TipTap : sa sérialisation diffère.
       Ouvrir la fiche, changer d'onglet (le champ est démonté) ou cliquer
       ailleurs (blur) ne doit pas remonter cette conversion comme une saisie. */
    const instance = render({ value: "ancien texte\nsans balises", onChange, legacy: true });
    instance.flush();
    unmount();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("n'émet rien au démontage après un rechargement de valeur non modifié", () => {
    const onChange = jest.fn();
    render({ value: "<p>a</p>", onChange });
    rerender({ value: "<cite>b</cite>", onChange });
    unmount();
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("HtmlEditor — reprise de la valeur", () => {
  it("recharge le contenu quand le formulaire change de valeur", () => {
    render({ value: "<p>a</p>" });
    rerender({ value: "<p>b</p>" });
    expect(q(".rbf-editor-content").textContent).toContain("b");
  });

  it("recharge le contenu au changement d'onglet de langue", () => {
    /* Les formulaires multi-langue rendent le champ dans un .map() : le
       changement d'onglet réutilise l'instance et ne change que le name. */
    const ref = React.createRef();
    ReactDOM.render(
      <HtmlEditor ref={ref} name="versions.0.body" value="<p>français</p>" />,
      container,
    );
    ReactDOM.render(
      <HtmlEditor ref={ref} name="versions.1.body" value="<p>anglais</p>" />,
      container,
    );
    expect(q(".rbf-editor-content").textContent).toContain("anglais");
  });

  it("reprend une valeur arrivée après le montage", () => {
    render({ value: "" });
    rerender({ value: "<p>chargé</p>" });
    expect(q(".rbf-editor-content").textContent).toContain("chargé");
  });
});

describe("HtmlEditor — remontée de la saisie", () => {
  it("émet au format attendu par les formulaires", () => {
    const onChange = jest.fn();
    const instance = render({ value: "<p>a</p>", onChange });
    instance.editor.commands.setContent("<p>modifié</p>", true);
    instance.flush();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual({
      target: { name: "body", value: "<p>modifié</p>", type: "text" },
    });
  });

  it("remonte la saisie au démontage, pour ne pas perdre la dernière frappe", () => {
    const onChange = jest.fn();
    const instance = render({ value: "<p>a</p>", onChange });
    instance.editor.commands.setContent("<p>dernière frappe</p>", true);
    onChange.mockClear();
    unmount();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toContain("dernière frappe");
  });

  it("remonte la saisie sur Ctrl+S sans attendre le blur", () => {
    const onChange = jest.fn();
    const instance = render({ value: "<p>a</p>", onChange });
    instance.editor.commands.setContent("<p>sauvegarde</p>", true);
    onChange.mockClear();
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "s", ctrlKey: true, bubbles: true }),
    );
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.value).toContain("sauvegarde");
  });
});

describe("HtmlEditor — nettoyage", () => {
  it("retire couleur, police et taille de tout le document", () => {
    const instance = render({
      value:
        '<p><span style="color: #ff0000; font-family: Georgia; font-size: 24px">a</span></p>',
    });
    instance.onClean("soft");
    const html = instance.editor.getHTML();
    expect(html).not.toContain("color");
    expect(html).not.toContain("font-family");
    expect(html).not.toContain("font-size");
    expect(html).toContain("a");
  });

  it("conserve le gras : « Nettoyer » n'est pas « Tout effacer »", () => {
    const instance = render({
      value: '<p><strong><span style="color: #ff0000">a</span></strong></p>',
    });
    instance.onClean("soft");
    expect(instance.editor.getHTML()).toContain("<strong>");
  });

  it("le vidage rend une chaîne vide, pour que required se déclenche", () => {
    const onChange = jest.fn();
    const instance = render({ value: "<p>a</p>", onChange });
    instance.onClear();
    expect(onChange).toHaveBeenCalled();
    expect(
      onChange.mock.calls[onChange.mock.calls.length - 1][0].target.value,
    ).toBe("");
  });
});

describe("HtmlEditor — vue source", () => {
  it("bascule vers le HTML brut et revient", () => {
    const instance = render({ value: "<p>a</p>" });
    instance.onToggleSource();
    expect(q("textarea.rbf-editor-source-text")).not.toBeNull();
    instance.onToggleSource();
    expect(q("textarea.rbf-editor-source-text")).toBeNull();
  });

  it("applique le HTML saisi en source", () => {
    const instance = render({ value: "<p>a</p>" });
    instance.onToggleSource();
    instance.onSourceChange({ target: { value: "<p>depuis la source</p>" } });
    instance.onToggleSource();
    expect(instance.editor.getHTML()).toContain("depuis la source");
  });

  it("avertit quand le HTML saisi n'est pas équilibré, sans bloquer", () => {
    const instance = render({ value: "<p>a</p>" });
    instance.onToggleSource();
    instance.onSourceChange({ target: { value: "<p>déséquilibré" } });
    instance.onToggleSource();
    expect(instance.state.sourceWarning).toBe("unbalanced");
    expect(instance.state.sourceBackup).toBe("<p>déséquilibré");
  });

  it("le contenu reste éditable après un aller-retour en source", () => {
    const instance = render({ value: "<p>a</p>" });
    instance.onToggleSource();
    instance.onToggleSource();
    expect(q(".rbf-editor-content")).not.toBeNull();
    expect(instance.editor.isDestroyed).toBe(false);
  });
});

describe("HtmlEditor — variables de fusion", () => {
  it("propose le menu à partir de la forme groupée", () => {
    render({
      mergeVars: [
        {
          key: "client",
          group: "Donateur",
          items: [{ code: "[[:client.cli_fullname:]]", label: "Nom" }],
        },
      ],
    });
    expect(q(".rbf-editor-toolbar")).not.toBeNull();
  });

  it("accepte l'ancienne forme plate presetTexts", () => {
    render({
      presetTexts: [
        { text_code: "[[:client.cli_fullname:]]", text_content: "Nom complet" },
      ],
    });
    expect(q(".rbf-editor-toolbar")).not.toBeNull();
  });
});
