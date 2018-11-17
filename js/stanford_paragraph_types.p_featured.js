/**
 * @file
 * Applies some functionality on the paragraph types.
 */

(function ($) {
  Drupal.behaviors.stanfordParagraphPFeatured = {

    attach: function (context, settings) {


      // Loop through each featured video fields and add a unique ID.
      $('.field-name-field-p-featured-video iframe', context).each(function (i, iframe) {
        // Make sure the video has an ID attribute.
        if (typeof $(iframe).attr('id') == 'undefined') {
          $(this).attr('id', 'featured-video-' + i);
        }
      });

      // If there is a vimeo video add the player api script.
      if ($('.field-name-field-p-featured-video iframe[src*="vimeo"]', context).length) {
        $.getScript('https://player.vimeo.com/api/player.js', function () {
          Drupal.behaviors.stanfordParagraphPFeatured.vimeoReady();
        });
      }
    },

    /**
     * Called after YouTubes API is ready and adds event reactions to videos.
     */
    youTubeReady: function () {
      // For each of the featured images, but only once, add onload/onready events
      // to its sibling video player.
      $('.field-name-field-p-featured-image').once('youtube', function (i, featuredImage) {

        // Look for a featured video.
        var $video = $(featuredImage).siblings('.field-name-field-p-featured-video').find('iframe[src*="youtube"]');

        // End if none. The user might have only wanted an image, or it might
        // be a vimeo video.
        if (!$video.length) {
          return;
        }

        // Get Video Id and Attributes
        var $videoSource = $video.attr('src');
        var $srcParts = $videoSource.split('/');
        var $videoInfo  = $srcParts[4].split('?');
        var $videoId = $videoInfo[0];

        //Get video attributes
        var $videoAttr = decodeURIComponent($videoInfo[1]);
        $videoAttr = $videoAttr.replace(/&amp;/g, '&');

        // Helper function to get paramaters from iframe attributes
        function getUrlParameter(name) {
          name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
          var regex = new RegExp('(&amp;|)' + name + '=([^&#]*)', 'i' );
          var results = regex.exec($videoAttr);
          return results === null ? '' : results[0].replace(/\+/g, ' ');
        };

        // Get the width of the video
        $videoWidthParts = getUrlParameter('width');
        $videoWidthParts = $videoWidthParts.split('=');
        $videoWidth = $videoWidthParts[1];

        // Get the height of the video
        $videoHeightParts = getUrlParameter('height');
        $videoHeightParts = $videoHeightParts.split('=');
        $videoHeight = $videoHeightParts[1];

        $video.parent().attr('id', 'featured-video-' + i);
        $video.remove();

        var player = new YT.Player('featured-video-' + i, {
          height: $videoHeight,
          width: $videoWidth,
          videoId: $videoId,
          events: {
            'onReady': Drupal.behaviors.stanfordParagraphPFeatured.onYoutubePlayerReady
          },
          host: 'https://www.youtube.com'
        });
      });

    },

    /**
     * When the youtube video is ready to play, we'll add a play button over
     * the image and add the click listener.
     *
     * @param event
     */
    onYoutubePlayerReady: function (event) {

      $fieldWrapper = $(event.target.a.closest('.field-name-field-p-featured-video'));
      $imageOverlay = $fieldWrapper.siblings('.field-name-field-p-featured-image');

      var $play = Drupal.behaviors.stanfordParagraphPFeatured.getPlayerButton(event.target.getVideoUrl());
      // Add a click event to hide the featured image and play the video.
      $play.click(function (e) {
        // Mouse has eventPhase 3, keyboard has 2. we only add the mouse
        // event so that a keyboard will navigate the user to the respective
        // YouTube page.
        if (e.eventPhase == 3) {
          e.preventDefault();

          // Dad is the featured image.
          $dad = $(this).parent();
          $dad.hide();

          // Play and show the video.
          $fieldWrapper.show();
          event.target.playVideo();
        }
      });

      // Prepend the play button to the DOM.
      $imageOverlay.prepend($play);
    },


    /**
     * After vimeo API is loaded, add the play button and listener to iframes.
     */
    vimeoReady: function () {
      $('.field-name-field-p-featured-video iframe[src*="vimeo"]').each(function (i, iframe) {
        var player = new Vimeo.Player($(iframe));

        $fieldWrapper = $($(iframe).closest('.field-name-field-p-featured-video'));
        $imageOverlay = $fieldWrapper.siblings('.field-name-field-p-featured-image');

        var $play = Drupal.behaviors.stanfordParagraphPFeatured.getPlayerButton($(iframe).attr('src'));

        $play.click(function (e) {
          // Mouse has eventPhase 3, keyboard has 2. we only add the mouse
          // event so that a keyboard will navigate the user to the respective
          // Vimeo page.
          if (e.eventPhase == 3) {
            e.preventDefault();

            // Dad is the featured image.
            $dad = $(this).parent();
            $dad.hide();
            $dad.siblings('.group-overlay-text').hide();

            // Show and play the video.
            $fieldWrapper.show();
            player.play();
          }
        });

        // Prepend the play button to the DOM.
        $imageOverlay.prepend($play);
      });
    },

    /**
     * Get a generic play button link.
     *
     * @param hrefUrl
     *   The url of the given video iframe.
     * @returns {*|HTMLElement}
     *   The A tag element.
     */
    getPlayerButton: function (hrefUrl) {
      return $('<a>', {
        class: 'play-video',
        href: hrefUrl,
        title: Drupal.t('Play Video'),
        html: $('<i>', {
          class: 'fa fa-youtube-play icon-youtube-play',
          html: 'Play Video',
          'aria-label': Drupal.t('Play Video - Opens to the video website')
        })
      });
    }

  }
})(jQuery);

/**
 * Custom Event Listener for an Event in SOE Google Tag Manager
 * https://tagmanager.google.com
 * Use swsdevelopers@gmail.com to login
 * The GTM tag with the referenced event 'dpTrigger' is in: Listener YouTube Tag
 * Code Section:
 * // Create the event for Paragraph Videos
 * var dpYTReady = document.createEvent('Event');
 * // Define that the event name is 'dpTrigger'.
 * dpYTReady.initEvent('dpTrigger', true, true);
 * // Dispatch the event
 * document.dispatchEvent(dpYTReady);
 */
document.addEventListener('dpTrigger', function () {
  function readyYoutube(){
    if((typeof YT !== "undefined") && YT && YT.Player){
      Drupal.behaviors.stanfordParagraphPFeatured.youTubeReady();
    }else{
      setTimeout(readyYoutube, 100);
    }
  }
  readyYoutube();
});
