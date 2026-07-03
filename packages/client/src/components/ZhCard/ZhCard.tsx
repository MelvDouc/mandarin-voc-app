import ExampleList from "$/components/ExampleList/ExampleList.tsx";
import ZhmlBlock from "$/components/ZhmlBlock/ZhmlBlock.tsx";
import type { ZhmlBlockElementNode, ZhmlExampleListNode } from "$/types.ts";
import { NodeKinds } from "zhml";

export default function ZhCard({ nodes }: {
  nodes: (ZhmlBlockElementNode | ZhmlExampleListNode)[];
}) {
  return (
    <>
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
    </>
  );
}
