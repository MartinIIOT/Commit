import GObject from "gi://GObject";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import GtkSource from "gi://GtkSource?version=5";
import Adw from "gi://Adw";

import { relativePath } from "./util.js";

GtkSource.init();

const file = Gio.File.new_for_path(relativePath("./Editor.ui"));
const [, template] = file.load_contents(null);

const scheme_manager = GtkSource.StyleSchemeManager.get_default();
const style_manager = Adw.StyleManager.get_default();

export default GObject.registerClass(
  {
    GTypeName: "Editor",
    Template: template,
    Children: ["view", "buffer"],
    Signals: {
      "style-updated": {},
    },
  },
  class Editor extends Gtk.ScrolledWindow {
    _init(params = {}) {
      super._init(params);

      this.update_css();
      style_manager.connect("notify::dark", this.update_css.bind(this));
    }

    update_css() {
      const scheme = style_manager.dark ? "Builder-dark" : "Builder";
      this.buffer.set_style_scheme(scheme_manager.get_scheme(scheme));
    }

    // In GTK3 we had a signal widget.connect("style-updated")
    // but there is only vfunc options in GTK4
    vfunc_css_changed(...args) {
      super.vfunc_css_changed(...args);
      super.emit("style-updated");
    }
  },
);