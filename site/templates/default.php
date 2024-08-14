<?php snippet('html/header') ?>

<main
  data-barba='container'
  data-barba-namespace='<?= $view = $page->intendedTemplate()->name() ?>'
>
  <?php snippet(["views/$view", 'views/default']) ?>
</main>

<?php snippet('html/footer') ?>
