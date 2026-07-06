# Mandarin voc app

My personal app to study Mandarin Chinese.

## Stack

- JS runtime: PNPM
- Virtualization: Docker Compose
- Database: PostgreSQL
- Server: Hono + TypeScript
- Client: React + Vite + TypeScript
- Production server: Nginx

## ZHML

Stands for "**ZH**ōngwén **M**arkup **L**anguage" &mdash; a markup language I created to write down my notes. The point is to represent the complex HTML needed for Chinese characters in an economical way.

### Example

```zhml
~ topic #[是 shi1]

structure subject + $topic + predicative complement

examples

example #1[我 wo3] #2[$topic] #3[法国人 fa3guo2ren2] 。
trl *1[I] *2[am] *3[French].

end examples
```

can be transpiled to something like:

```html
<div class="structure">subject + <ruby>是 <rt>shī</rt></ruby> + predicative complement</div>

<ul class="examples">
  <li>
    <div class="example">
      <ruby data-id="1">我 <rt>wǒ</rt></ruby>
      <ruby data-id="2">是 <rt>shī</rt></ruby>
      <ruby data-id="3">法国人 <rt>fǎguórén</rt></ruby>
      。
    </div>
    <div class="translation">
      <zh-trl data-id="1">I</zh-trl> <zh-trl data-id="2">am</zh-trl> <zh-trl data-id="3">French</zh-trl>.
    </div>
  </li>
</ul>
```

with some JavaScript to highlight a Chinese word and its translation simultaneously on hover.
