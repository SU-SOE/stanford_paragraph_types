/**
 * @file
 * Applies some functionality on the paragraph types in the admin form.
 */

(function ($) {
  Drupal.behaviors.stanfordParagraphTypesAdmin = {
    attach: function (context, settings) {

      $('.field-name-field-p-icon-color option', context).each(function () {
        $(this).addClass('color-' + $(this).attr('value'));
      });

      $('.group-p-card-cta', context).each(function () {
        $group = this;
        $(this).find('.form-radio').each(function () {
          if ($(this).is(':checked')) {
            teaserCardsCTA($group, $(this).val());
          }
          $(this).change(function () {
            teaserCardsCTA($group, $(this).val());
          });
        });
      });

      $('.field-name-field-p-hero-style', context).each(function () {
        $style = $(this);

        $(this).find('.form-radio').each(function () {
          if ($(this).is(':checked')) {
            heroStyle($style, $(this).val());
          }
          $(this).change(function () {
            heroStyle($style, $(this).val());
          });
        });
      });

      $('.field-name-field-p-featured-style', context).each(function () {
        $(this).find('.form-radio').each(function () {
          if ($(this).is(':checked')) {
            featuredStyle($(this).val());
          }
          $(this).change(function () {
            featuredStyle($(this).val());
          });
        });
      });

      $('.field-name-field-p-featured-cta-button', context).each(function () {
        $(this).find('.form-radio').each(function () {
          if ($(this).is(':checked')) {
            featuredCTAbutton($(this).val());
          }
          $(this).change(function () {
            featuredCTAbutton($(this).val());
          });
        });
      });

      $('.field-name-field-p-featured-button-color', context).each(function () {
        $(this).find('.form-radio').each(function () {
          if ($(this).is(':checked')) {
            featuredButtonColor($(this).val());
          }
          $(this).change(function () {
            featuredButtonColor($(this).val());
          });
        });
      });

      // Used this method vs conditional_fields since the contrib module failed
      // to function correctly after a 2nd item was added.
      function teaserCardsCTA(group, radioVal) {
        if (radioVal == 'link') {
          $(group).find('.field-name-field-p-card-cta').show();
          $(group).find('.field-name-field-p-card-file').hide();
        }
        else {
          $(group).find('.field-name-field-p-card-cta').hide();
          $(group).find('.field-name-field-p-card-file').show();
        }
      }

      function heroStyle($style, radioVal) {
        if (radioVal == 'image') {
          $style.siblings('.field-name-field-p-hero-image').show();
          $style.siblings('.field-name-field-p-hero-video').hide();
        }
        else if (radioVal == 'video') {
          $style.siblings('.field-name-field-p-hero-image').hide();
          $style.siblings('.field-name-field-p-hero-video').show();
        }
        else {
          $style.siblings().show();
        }
      }

      function featuredStyle(radioVal) {
        oFormObject = document.forms['bean-form'];

        if (radioVal == 'image') {
          // We hide the video if it is image only.
          $('#edit-field-featured-block-featured-und-0-field-p-featured-image').show();
          $('#edit-field-featured-block-featured-und-0-field-p-featured-video').hide();
          oFormObject.elements["edit-field-featured-block-featured-und-0-field-p-featured-video-und-0-video-url"].value = '';
        }
        else if (radioVal == 'video') {
          // We hide the image if it is video only.
          $('#edit-field-featured-block-featured-und-0-field-p-featured-image').hide();
          oFormObject.elements["edit-field-featured-block-featured-und-0-field-p-featured-more-link-und-0-title"].value = '';
          oFormObject.elements["edit-field-featured-block-featured-und-0-field-p-featured-more-link-und-0-url"].value = '';
          // remove the image if video only.
          $('#edit-field-featured-block-featured-und-0-field-p-featured-image-und-0-remove-button').trigger("mousedown");
          $('#edit-field-featured-block-featured-und-0-field-p-featured-video').show();
        }
        else {
          // Otherwise show both image and video.
          $('#edit-field-featured-block-featured-und-0-field-p-featured-image').show();
          $('#edit-field-featured-block-featured-und-0-field-p-featured-video').show();
          oFormObject.elements["edit-field-featured-block-featured-und-0-field-p-featured-more-link-und-0-title"].value = '';
          oFormObject.elements["edit-field-featured-block-featured-und-0-field-p-featured-more-link-und-0-url"].value = '';
        }
      }

      function featuredCTAbutton(radioVal) {
        oFormObject = document.forms['bean-form'];

        // Don't show the link attribute class field.
        $('#field-featured-block-featured-und-0-field-p-featured-more-link-add-more-wrapper .link-attributes').hide();

        // CTA Button or no cta button, that is the question.
        if (radioVal == 'yes') {
          document.getElementById("edit-field-featured-block-featured-und-0-field-p-featured-button-color-und-none").checked = true;
          oFormObject.elements["field_featured_block_featured[und][0][field_p_featured_more_link][und][0][attributes][class]"].value = 'btn';
          oFormObject.elements["field_featured_block_featured[und][0][field_p_featured_more_link][und][0][attributes][class]"].readOnly = true;
          $('.field-name-field-p-featured-button-color').show();

        }
        else if (radioVal == 'no') {
          oFormObject.elements["field_featured_block_featured[und][0][field_p_featured_more_link][und][0][attributes][class]"].value = '';
          oFormObject.elements["field_featured_block_featured[und][0][field_p_featured_more_link][und][0][attributes][class]"].readOnly = false;
          $('.field-name-field-p-featured-button-color').hide();
        }
      }

      function featuredButtonColor(radioVal) {
        oFormObject = document.forms['bean-form'];
        // We change the class depending on which color button.
        if (radioVal == '_none') {
          oFormObject.elements["field_featured_block_featured[und][0][field_p_featured_more_link][und][0][attributes][class]"].value = 'btn';
          oFormObject.elements["field_featured_block_featured[und][0][field_p_featured_more_link][und][0][attributes][class]"].readOnly = true;

        }
        else if (radioVal == 'orange') {
          oFormObject.elements["field_featured_block_featured[und][0][field_p_featured_more_link][und][0][attributes][class]"].value = 'btn-orange';
          oFormObject.elements["field_featured_block_featured[und][0][field_p_featured_more_link][und][0][attributes][class]"].readOnly = true;
        }
        else if (radioVal == 'pink') {
          oFormObject.elements["field_featured_block_featured[und][0][field_p_featured_more_link][und][0][attributes][class]"].value = 'btn-pink';
          oFormObject.elements["field_featured_block_featured[und][0][field_p_featured_more_link][und][0][attributes][class]"].readOnly = true;
        }
        else if (radioVal == 'turquoise') {
          oFormObject.elements["field_featured_block_featured[und][0][field_p_featured_more_link][und][0][attributes][class]"].value = 'btn-turquoise';
          oFormObject.elements["field_featured_block_featured[und][0][field_p_featured_more_link][und][0][attributes][class]"].readOnly = true;
        }
      }

      $('.field-name-field-p-icon-icon-style input', context).change(function () {
        var fieldset = $(this).closest('fieldset');
        pIconStyleHideShow(fieldset, $(this).val());
      });

      function pIconGridStyle() {
        $('.field-name-field-p-icon-icon-style input:checked').each(function () {
          pIconStyleHideShow($(this).closest('fieldset'), $(this).val());
        });
      }

      function pIconStyleHideShow(fieldset, value) {
        var showFields = ['.field-name-field-p-icon-icon-style'];
        var hideFields = [];

        switch (value) {
          case 'icon':
            showFields.push('.field-name-field-p-icon-icon');
            hideFields.push('.field-name-field-p-icon-image');
            hideFields.push('.field-name-field-p-icon-text');
            break;

          case 'image':
            showFields.push('.field-name-field-p-icon-image');
            hideFields.push('.field-name-field-p-icon-icon');
            hideFields.push('.field-name-field-p-icon-text');
            break;

          case 'text':
            showFields.push('.field-name-field-p-icon-text');
            hideFields.push('.field-name-field-p-icon-icon');
            hideFields.push('.field-name-field-p-icon-image');
            break;

        }
        $.each(showFields, function (i, field) {
          $(fieldset).find(field).show().find('select').trigger('chosen:updated');
        });
        $.each(hideFields, function (i, field) {
          $(fieldset).find(field).hide();
        });
      }

      pIconGridStyle();
    }
  }
})(jQuery);
