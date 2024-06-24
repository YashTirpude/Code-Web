import React, { useEffect, useRef, useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/css/css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/edit/matchbrackets";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/matchtags";
import ACTIONS from "../Actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompressAlt, faExpandAlt } from "@fortawesome/free-solid-svg-icons";

const Editor = ({
  value,
  onChange,
  language,
  title,
  background,
  icon,
  socketRef,

  roomId,
}) => {
  const [open, setOpen] = useState(true);

  const editorRef = useRef(null);

  const editorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleChange = (editor, data, value) => {
    onChange(value);

    if (data.origin !== "setValue") {
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: value,
        language,
      });
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      const handleCodeChange = ({ code, language: lang }) => {
        const currentCode = editorRef.current.getValue();
        if (lang === language) {
          if (code !== null && code !== currentCode) {
            editorRef.current.setValue(code);
          }
        }
      };

      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);

      return () => {
        socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
      };
    }
  }, [socketRef.current]);

  return (
    <div className={`editor-container ${open ? "" : "collapsed"}`}>
      <div className="editor-header">
        <div className="title" style={{ background: background }}>
          <img src={icon} alt="" className="icon" />
          {title}
          <button
            className="expand-collapse-btn"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
          >
            <FontAwesomeIcon icon={open ? faCompressAlt : faExpandAlt} />
          </button>
        </div>
      </div>

      <CodeMirror
        className="codeMirror"
        editorDidMount={editorDidMount}
        value={value}
        onBeforeChange={handleChange}
        options={{
          theme: "darcula",
          lineNumbers: true,
          mode: language,
          lineWrapping: true,
          autoCloseBrackets: true,
          matchBrackets: true,
          matchTags: true,
          autoCloseTags: true,
        }}
      />
    </div>
  );
};

export default Editor;
