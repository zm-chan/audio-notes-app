import "@mdxeditor/editor/style.css";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  ConditionalContents,
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
  { content, debouncedHandleEditContent },
  ref,
) {
  return (
    <>
      <MDXEditor
        ref={ref}
        markdown={content}
        onChange={debouncedHandleEditContent}
        onError={console.log}
        plugins={[
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
                </>
              );
            },
          }),
        ]}
        className="[&_div.mdxeditor-toolbar]:rounded-b-none"
        contentEditableClassName="bg-zinc-600 rounded-b prose prose-invert font-['Poppins'] max-w-none"
      />
    </>
  );
});

export default MarkDownEditor;