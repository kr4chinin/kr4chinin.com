---
title: 'Markdown Features'
description: 'A showcase of markdown and MDX features available in this blog'
date: 2025-10-08
draft: false
---

# Markdown Features

This post demonstrates the various markdown features supported in this blog.

## Headings

You can use headings from H1 to H6:

### This is an H3

#### This is an H4

##### This is an H5

## Text Formatting

You can use **bold text**, _italic text_, or **_both at once_**.

## Lists

Unordered lists:

- Item one
- Item two
- Item three
  - Nested item
  - Another nested item

Ordered lists:

1. First item
2. Second item
3. Third item

## Links and Images

Check out my [GitHub profile](https://github.com/kr4chinin) for more projects.

## Code

Inline code: `const greeting = 'Hello, World!';`

Code blocks with syntax highlighting:

```typescript
interface User {
	name: string;
	email: string;
	role: 'admin' | 'user';
}

function createUser(data: User): User {
	return {
		...data,
		role: data.role || 'user',
	};
}
```

## Blockquotes

> "The best way to predict the future is to invent it."
>
> — Alan Kay

## Horizontal Rules

You can add horizontal rules to separate sections:

---

## Tables

| Feature             | Supported | Notes              |
| ------------------- | --------- | ------------------ |
| Markdown            | ✅        | Full support       |
| MDX                 | ✅        | With components    |
| Syntax Highlighting | ✅        | Multiple languages |

## That's It!

These are the basic markdown features available in this blog. More advanced features like MDX components can be added as needed.
