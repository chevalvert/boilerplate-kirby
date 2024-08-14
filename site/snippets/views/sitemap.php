<?php
  function walk (Page $page) {
    if (!$page) return;
    if (in_array($page->uri(), option('sitemap.ignore', ['error']))) return;

    echo Html::tag('li', [Html::a($page->url(), $page->title())]);
    if (($children = $page->children()->listed()) && $children->count() >= 1) {
      echo '<ul>';
      foreach ($children as $child) walk($child);
      echo '</ul>';
    }
  }
?>

<?php snippet('components/Article', [
  'title' => t('sitemap')
], slots: true) ?>
  <?php slot('content') ?>
    <ul class='prose'>
      <?php foreach (site()->children()->listed() as $page) walk($page) ?>
    </ul>
  <?php endslot() ?>
<?php endsnippet() ?>
