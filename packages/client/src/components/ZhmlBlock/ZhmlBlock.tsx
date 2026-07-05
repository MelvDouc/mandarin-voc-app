import Zh from "$/components/Zh/Zh.tsx";
import type { ZhmlBlockElementNode } from "$/types.ts";
import { NodeKinds } from "zhml";
import cssClasses from "./ZhmlBlock.module.scss";

export default function ZhmlBlock({ node }: {
  node: ZhmlBlockElementNode;
}) {
  switch (node.localName) {
    case "p":
      return (
        <p>
          <Children nodes={node.children} />
        </p>
      );
    default:
      return (
        <div className={cssClasses[node.localName]}>
          <Children nodes={node.children} />
        </div>
      );
  }
}

function Children({ nodes }: {
  nodes: ZhmlBlockElementNode["children"];
}) {
  return nodes.map((node, i) => {
    switch (node.kind) {
      case NodeKinds.Text:
        return node.value;
      case NodeKinds.Zh:
        return (
          <Zh
            key={i}
            zh={node.zh}
            py={node.py}
            id={node.id}
            highlightedId={null}
            setHighlightedId={null}
          />
        );
    }
  });
}