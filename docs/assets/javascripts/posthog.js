// PostHog Analytics - Cookie-free tracking
!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

// Initialize PostHog
posthog.init('phc_8vaqqy1HdH46zgpioDjVq1rQb0yHaBGXMXOYKA16XsM', {
  api_host: 'https://eu.i.posthog.com',
  cookieless_mode: 'always',
  person_profiles: 'identified_only',
  autocapture: false,
  capture_pageview: true,
  capture_pageleave: true
});

// Track all link clicks
document.addEventListener('DOMContentLoaded', function() {

  // Track clicks to practical-ai-leadership.com (consulting funnel)
  var consultingLinks = document.querySelectorAll('a[href*="practical-ai-leadership.com"]');
  consultingLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      posthog.capture('consulting_site_clicked', {
        from_page: window.location.pathname,
        to_url: this.href,
        link_text: this.innerText || this.textContent
      });
    });
  });

  // Track social profile clicks (LinkedIn, YouTube, Twitter)
  var linkedinLinks = document.querySelectorAll('a[href*="linkedin.com"]');
  linkedinLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      posthog.capture('social_clicked', {
        platform: 'linkedin',
        from_page: window.location.pathname,
        to_url: this.href,
        link_text: this.innerText || this.textContent
      });
    });
  });

  var youtubeLinks = document.querySelectorAll('a[href*="youtube.com"]');
  youtubeLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      var isVideo = this.href.includes('watch?v=');
      posthog.capture('social_clicked', {
        platform: 'youtube',
        content_type: isVideo ? 'video' : 'channel',
        from_page: window.location.pathname,
        to_url: this.href,
        link_text: this.innerText || this.textContent
      });
    });
  });

  var twitterLinks = document.querySelectorAll('a[href*="twitter.com"], a[href*="x.com"]');
  twitterLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      posthog.capture('social_clicked', {
        platform: 'twitter',
        from_page: window.location.pathname,
        to_url: this.href,
        link_text: this.innerText || this.textContent
      });
    });
  });

  // Track external reference clicks (blog post sources, citations)
  var externalLinks = document.querySelectorAll('a[href^="http"]');
  externalLinks.forEach(function(link) {
    var href = link.href;
    // Skip already tracked links
    if (href.includes('practical-ai-leadership.com') ||
        href.includes('linkedin.com') ||
        href.includes('youtube.com') ||
        href.includes('twitter.com') ||
        href.includes('x.com') ||
        href.includes('vmalyi.com')) {
      return;
    }
    link.addEventListener('click', function() {
      posthog.capture('external_reference_clicked', {
        from_page: window.location.pathname,
        to_url: this.href,
        link_text: this.innerText || this.textContent,
        domain: new URL(this.href).hostname
      });
    });
  });

});
