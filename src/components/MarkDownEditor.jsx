import "@mdxeditor/editor/style.css";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  ConditionalContents,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  InsertCodeBlock,
  InsertTable,
  InsertThematicBreak,
  listsPlugin,
  ListsToggle,
  MDXEditor,
  quotePlugin,
  Separator,
  StrikeThroughSupSubToggles,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { forwardRef } from "react";

const MarkDownEditor = forwardRef(function MarkDownEditor(
  { content, handleEditContent },
  ref,
) {
  return (
    <>
      <MDXEditor
        ref={ref}
        markdown={content}
        onBlur={handleEditContent}
        onError={console.log}
        plugins={[
          diffSourcePlugin({
            viewMode: "rich-text",
            readOnlyDiff: true,
          }),
          headingsPlugin(),
          quotePlugin(),
          tablePlugin(),
          thematicBreakPlugin(),
          listsPlugin(),
          codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              js: " JavaScript",
              css: "CSS",
              jsx: "JavaScript (React)",
              ts: "TypeScript",
              tsx: "TypeScript (React)",
            },
          }),
          toolbarPlugin({
            toolbarContents: () => {
              return (
                <>
                  <ConditionalContents
                    options={[
                      {
                        when: (editor) => editor?.editorType === "codeblock",
                        contents: () => <ChangeCodeMirrorLanguage />,
                      },
                      {
                        fallback: () => (
                          <>
                            <UndoRedo />
                            <Separator />
                            <BlockTypeSelect />
                            <Separator />
                            <BoldItalicUnderlineToggles />
                            <Separator />
                            <StrikeThroughSupSubToggles />
                            <Separator />
                            <CodeToggle />
                            <InsertCodeBlock />
                            <Separator />
                            <InsertTable />
                            <InsertThematicBreak />
                            <Separator />
                            <ListsToggle />
                          </>
                        ),
                      },
                    ]}
                  />
                  <DiffSourceToggleWrapper />
                </>
              );
            },
          }),
        ]}
        className="[&_div.mdxeditor-toolbar]:-top-4 [&_div.mdxeditor-toolbar]:rounded-b-none"
        contentEditableClassName="bg-zinc-600 rounded-b prose prose-invert font-['Poppins'] max-w-none"
      />
    </>
  );
});

export default MarkDownEditor;
