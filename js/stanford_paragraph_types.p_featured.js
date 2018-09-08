/**
 * @file
 * Applies some functionality on the paragraph types.
 */

(function ($) {
  Drupal.behaviors.stanfordParagraphPFeatured = {
    attach: function (context, settings) {
      $('.field-name-field-p-featured-image', context).each(function () {
        var video = $(this).siblings('.field-name-field-p-featured-video');

        if (video.length) {
          $(video).find('iframe').attr('title', Drupal.t('Video Player'));
          var videoUrl = $(video).find('div[data-video-embed-url]').attr('data-video-embed-url');

          var play = $('<a>', {
            class: 'play-video',
            href: videoUrl,
            html: $('<i>', {
              class: 'fa fa-youtube-play icon-youtube-play',
              html: '',
              'aria-label': Drupal.t('Play Video - Opens to the video website')
            })
          }).click(function (e) {

            // Mouse has eventPhase 3, keyboard has 2.
            if (e.eventPhase == 3) {
              e.preventDefault();
              $dad = $(this).parent();

              // Push the image overlay behind the video
              $dad.css('z-index', 1);

              var iframe = $(video).find('iframe')[0];

              iframe.src += "&autoplay=1";
              $(iframe).attr('onload', 'this.contentWindow.focus()');

              // We need to change to absolute for correct style
              $(video).css('position', 'absolute');
              $(video).show();
            }

          });

          $(this).prepend(play);
        }
      });
    }
  }
})(jQuery);
