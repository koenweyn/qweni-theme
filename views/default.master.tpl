<!DOCTYPE html>
<html lang="en" class="sticky-footer-html">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    {asset name="Head"}
  </head>
  <body id="{$BodyID}" class="{$BodyClass} sticky-footer-body">
    <section class="header">
      <div class="container">
        <div class="logo"><a href="/"><img title="Qweni"/></a></div>
        <div class="aapjes hidden-xs"></div>
      </div>
    </section>
    <nav class="navbar navbar-default navbar-static-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">{t c="Toggle navigation"}</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          {*<a class="navbar-brand hidden-sm" href="{link path="home"}">{logo}</a>*}
        </div>

        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li><a href="/" title="Home" class="home"><i class="fa fa-home"></i></a></li>

            {categories_link}
            {discussions_link}
            {activity_link}
          </ul>
          {if $User.SignedIn}
            <ul class="nav navbar-nav navbar-right hidden-xs">
              {module name="MeModule"}
            </ul>
            <ul class="nav navbar-nav navbar-right visible-xs">
              {profile_link}
              {inbox_link}
              {bookmarks_link}
              {dashboard_link}
              {signinout_link}
            </ul>
          {else}
            <ul class="nav navbar-nav navbar-right">
              {signin_link}
            </ul>
          {/if}
        </div>
      </div>
    </nav>

    <section class="container">
      <div class="row">
        <main class="page-content" role="main">
          {breadcrumbs}
          {if InSection(array("CategoryList", "CategoryDiscussionList", "DiscussionList"))}
            <div class="well search-form">{searchbox}</div>
          {/if}
          {asset name="Content"}
        </main>

        <aside class="page-sidebar" role="complementary">
          {asset name="Panel"}
        </aside>
      </div>
    </section>

    <footer class="page-footer sticky-footer">
      <div class="container">
        <div class="clearfix">
          <p class="pull-left">{t c="Copyright"} &copy; {$smarty.now|date_format:"%Y"} <a href="{link path="home"}">{logo}</a>
          </p>
          <p class="pull-left supporters">
            met de steun van <img src="/themes/qweni-theme/design/a.jpg" alt="Stad Antwerpen">
            en <img src="/themes/qweni-theme/design/kwadraat.jpg" alt="Kwadraat">
          </p>
          <p class="pull-right"><!--suppress HtmlUnknownTarget -->
            <a href="/disclaimer">Disclaimer</a></p>
{*
          <p class="pull-right hidden-xs">{t c="Built with"} <i class="InformSprite Heart"></i> {t c="and"} <a href="http://getbootstrap.com">Bootstrap</a>. {t c="Powered by"} <a href="{vanillaurl}">Vanilla Forums</a>
            <!-- A lot of time was put into this project - a "Follow" and a "Star" would be most appreciated! -->
            <iframe src="http://ghbtns.com/github-btn.html?user=kasperisager&type=follow" allowtransparency="true" frameborder="0" scrolling="0" width="145" height="20" style="vertical-align:top;margin-left:20px;"></iframe>
            <iframe src="http://ghbtns.com/github-btn.html?user=kasperisager&repo=vanilla-bootstrap&type=watch&count=true" allowtransparency="true" frameborder="0" scrolling="0" width="80" height="20" style="vertical-align:top;"></iframe>
          </p>
*}
        </div>
        {asset name="Foot"}
      </div>
    </footer>

    {event name="AfterBody"}
  </body>
</html>
