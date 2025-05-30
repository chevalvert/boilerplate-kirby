<?php

// Config helper to quickly define date.formats options
function intl (string $pattern, ?string $locale = 'fr_FR') {
  return new IntlDateFormatter($locale, IntlDateFormatter::FULL, IntlDateFormatter::SHORT, null, IntlDateFormatter::GREGORIAN, $pattern);
}

// Config helper to add a Page as a panel.menu entry
function menu ($kirby, string $uid, string $icon = 'page') {
  $page = $kirby->page($uid);
  if (!$page) return;

  return [
    'icon' => $page->blueprint()->icon() ?? $icon,
    'label' => $page->title(),
    'link' => $page->panel()->url(),
    'current' => function (string $current) use ($uid) : bool {
      $path = Kirby\Cms\App::instance()->path();
      return Str::contains($path, "pages/$uid");
    }
  ];
}

// Dump to PHP console
function console_dump (mixed $value, bool $clear = true) {
  if ($clear) error_log("\e[H\e[J");
  error_log(print_r($value, true));
}
