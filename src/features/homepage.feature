Feature: test

  Scenario Outline: test

    Given I published a content for <segmentSelection> segment with <imageId> image ID, <imageUrl> image url, <redirectionUrl> redirection url, <altText> alt text for <slotDeliveryKey> slot on Amplience
    Given I overrode "FirstoryMobileSlotGroup2" fragment with <slotDeliveryKey> slot delivery key
    When I open "Homepage" page in "Mobile" platform, <countryCode> country code, <language> language as a user in <userSegment> segment
    Then I should see content with <imageId> image ID, <imageUrl> image URL, <redirectionUrl> redirection URL, <altText> alt text on <slotDeliveryKey> slot

    Examples:
   |segmentSelection|platformSelection|slotDeliveryKey                                               |countryCode|language|userSegment|imageId                             |imageUrl                                                 |redirectionUrl                   |altText                  |  
   |Acquisition     |MW               |ac-s15-segment_set_platform_set-mobile_slider_slot1_aw        |SE         |EN      |Acquisition|0d2540fe-73b7-45aa-a0c1-80bc90caa71d|https://cdn.media.amplience.net/i/modanisa/540x540_en_1  |https://m.modanisa.com/en/basket/|acq en mw                |

