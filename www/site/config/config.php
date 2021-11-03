<?php

return array_merge(require_once 'credentials.php', [
  'cache' => true,

  'routes' => [
    [ // Quick access to the panel from any page by suffixing url with /panel
      'pattern' => '(:all)/panel',
      'action' => function ($id) {
        if (($page = page($id)) || $page = page("projects/$id")) {
          return go($page->panelUrl());
        }
      }
    ],

    [ // Sitemap
      'pattern' => ['sitemap', 'sitemap.xml', 'sitemap_index.xml'],
      'action'  => function() {
        $pages = site()->pages()->index();
        $ignore = kirby()->option('sitemap.ignore', ['error']);
        $content = snippet('html/sitemap', compact('pages', 'ignore'), true);
        return new Kirby\Cms\Response($content, 'application/xml');
      }
    ]
  ]
]);
