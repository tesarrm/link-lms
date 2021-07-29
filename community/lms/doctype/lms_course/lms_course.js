// Copyright (c) 2021, FOSS United and contributors
// For license information, please see license.txt

frappe.ui.form.on('LMS Course', {

  onload: function (frm) {
    frm.set_query("chapter", "chapters", function () {
      return {
        filters: {
          "course": frm.doc.name,
        }
      };
    });
  }

});
