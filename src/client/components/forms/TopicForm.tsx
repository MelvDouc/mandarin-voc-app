import Button from "$/client/components/Button/Button.jsx";
import ErrorWrapper from "$/client/components/ErrorWrapper/ErrorWrapper.jsx";
import Form from "$/client/components/Form/Form.jsx";
import FormTopicCategorySelect from "$/client/components/forms/FormTopicCategorySelect.js";
import TopicTags from "$/client/components/TopicTags/TopicTags.jsx";
import type { Category, Tag, Topic, WithoutId } from "$/client/types.js";
import { validateXml } from "$/client/utils/xml-parser.js";
import type { Obs } from "reactfree-jsx";

export default function TopicForm({ topic, categories, tags, handleSubmit, errorObs }: {
  topic: Topic | null;
  categories: Category[];
  tags: Tag[];
  handleSubmit: (topic: WithoutId<Topic>) => Promise<void>;
  errorObs: Obs<string[] | null>;
}) {
  const t = topic ?? {
    id: 0,
    title: "",
    slug: "",
    content: "<page></page>",
    category: null,
    tags: []
  };

  const onsubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    const err = validateXml(t.content);
    if (err !== true) {
      errorObs.value = [err.err.msg];
      return;
    }
    await handleSubmit(t);
  };

  return (
    <ErrorWrapper errorObs={errorObs}>
      <Form onsubmit={onsubmit}>
        <Form.Row>
          <Form.Column>
            <label htmlFor="title">Title</label>
            <Form.Input type="text" id="title" value={t.title} bind={[t, "title"]} required />
          </Form.Column>
          <Form.Column>
            <label htmlFor="slug">Slug</label>
            <Form.Input type="text" id="slug" value={t.slug} bind={[t, "slug"]} required />
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <label htmlFor="content">Content</label>
            <Form.Textarea
              id="content"
              value={t.content}
              bind={[t, "content"]}
              onkeydown={handleTab}
              required
            />
          </Form.Column>
        </Form.Row>
        <Form.Row>
          <Form.Column>
            <label htmlFor="category_id">Category</label>
            <FormTopicCategorySelect id="category_id" topic={t} categories={categories} />
          </Form.Column>
        </Form.Row>
        {tags.length > 0 && (
          <Form.Row>
            <Form.Column>
              <label>Tags</label>
              <TopicTags topic={t} tags={tags} errorObs={errorObs} />
            </Form.Column>
          </Form.Row>
        )}
        <section>
          <Button type="submit" color="green">Submit</Button>
        </section>
      </Form>
    </ErrorWrapper>
  );
}

function handleTab(e: KeyboardEvent) {
  if (e.key !== "Tab")
    return;
  e.preventDefault();
  const target = e.target as HTMLTextAreaElement;
  const { selectionStart, selectionEnd, value } = target;
  target.value = value.slice(0, selectionStart) + "  " + value.slice(selectionEnd);
  target.setSelectionRange(selectionStart + 2, selectionStart + 2);
}