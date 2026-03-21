import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const MarkdownRenderer = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className="my-4 rounded-lg overflow-hidden border border-gray-700 shadow-md">
              <div className="bg-gray-800 px-4 py-1.5 text-xs text-gray-400 border-b border-gray-700 flex justify-between items-center">
                <span>{match[1].toUpperCase()}</span>
              </div>
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="!m-0 !bg-[#121826]"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : (
            <code className="bg-gray-800 px-1.5 py-0.5 rounded text-accent font-mono text-sm" {...props}>
              {children}
            </code>
          );
        },

        p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed text-sm text-gray-200">{children}</p>,
        ul: ({ children }) => <ul className="list-disc ml-5 mb-3 space-y-1 text-sm text-gray-300">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal ml-5 mb-3 space-y-1 text-sm text-gray-300">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        h1: ({ children }) => <h1 className="text-xl font-bold mb-4 mt-2 text-white">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-bold mb-3 mt-2 text-white">{children}</h2>,
        h3: ({ children }) => <h3 className="text-md font-bold mb-2 mt-2 text-white">{children}</h3>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary pl-4 py-1 italic my-4 bg-primary/5 rounded-r">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
