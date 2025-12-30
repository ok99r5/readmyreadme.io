---
layout: default
title: Blog
---

# Blog

{% for post in site.posts %}
  <article>
    <h2><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h2>
    <p>{{ post.date | date: "%Y-%m-%d" }} · {{ post.author }}</p>
    <p>{{ post.excerpt }}</p>
  </article>
{% endfor %}
