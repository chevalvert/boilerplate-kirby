<?php
  if (!isset($_SERVER['HTTP_X_BARBA'])) {
    snippet('html/header');
    snippet('components/Menu');
  }
?>

<main
  data-barba='container'
  data-barba-namespace='<?= $view = $page->intendedTemplate()->name() ?>'
  data-title='<?= snippet('html/title', [], true) ?>'
>
  <?php snippet(["views/$view", 'views/default']) ?>
</main>

<?php
  if (!isset($_SERVER['HTTP_X_BARBA'])) {
    snippet('html/footer');
  }
?>
