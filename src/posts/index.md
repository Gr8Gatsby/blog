---
title: "Blog Posts"
layout: "default"  # Or your specific layout
---

# All Blog Posts

<ul>
  {% for post in collections.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.data.title }}</a> - {{ post.date | date: "%B %d, %Y" }}
    </li>
  {% endfor %}
</ul>