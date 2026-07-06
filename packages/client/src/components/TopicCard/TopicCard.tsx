import ExampleList from "$/components/ExampleList/ExampleList.tsx";
import ZhmlBlock from "$/components/ZhmlBlock/ZhmlBlock.tsx";
import type { ZhmlBlockElementNode, ZhmlExampleListNode } from "$/types.ts";
import { NodeKinds } from "zhml";
import cssClasses from "./TopicCard.module.scss";

export default function TopicCard({ nodes }: {
  nodes: (ZhmlBlockElementNode | ZhmlExampleListNode)[];
}) {
  return (
    <div className={cssClasses.ZhCard}>
      {nodes.map((node, i) => {
        switch (node.kind) {
          case NodeKinds.BlockElement:
            return (
              <ZhmlBlock key={i} node={node} />
            );
          case NodeKinds.ExampleList:
            return (
              <ExampleList key={i} nodes={node.children} />
            );
        }
      })}
    </div>
  );
}