//console.log = function (){ postAction({type: 'LOG', data: Array.prototype.slice.call(arguments)});};
const HTML = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="user-scalable=1.0,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0">
    <style>
        * {outline: 0px solid transparent;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-touch-callout: none;}
        html, body { margin: 0; padding: 0;font-family: Arial, Helvetica, sans-serif; font-size:1em;}
        body { overflow-y: hidden; -webkit-overflow-scrolling: touch;height: 100%;background-color: #FFF;}
        img {max-width: 98%;margin-left:auto;margin-right:auto;display: block;}
        .content {  font-family: Arial, Helvetica, sans-serif;color: #000033; width: 100%;height: 100%;-webkit-overflow-scrolling: touch;padding-left: 0;padding-right: 0;}
        .pell { height: 100%;}
        .pell-content { outline: 0; overflow-y: auto;padding: 10px;height: 100%;}
        table {width: 100% !important;}
        table td {width: inherit;}
        table span { font-size: 12px !important; }
        [placeholder]:empty:before {
            content: attr(placeholder);
            color: #a9a9a9;
        }
        [placeholder]:empty:focus:before {
            content: attr(placeholder);
            color: #a9a9a9;
        }
    </style>
    <style>
    body {
      position: relative;
    }
    .tribute-demo-input {
      outline: none;
      border: 1px solid #eee;
      padding: 3px 5px;
      border-radius: 2px;
      font-size: 15px;
      min-height: 32px;
      cursor: text;
    }
    .tribute-demo-input:focus {
      border-color: #d1d1d1;
      background-color: #fbfbfb;
    }
    [contenteditable="true"]:empty:before {
      content: attr(placeholder);
      display: block;
      color: #ccc;
    }
    #test-autocomplete-container {
      position: relative;
    }
    #test-autocomplete-textarea-container {
      position: relative;
    }
    .float-right {
      float: right;
    }
  </style>
  <style>
.tribute-container {
  position: absolute;
  top: 0;
  left: 0;
  height: auto;
  max-height: 300px;
  max-width: 500px;
  overflow: auto;
  display: block;
  z-index: 999999;
}
.avatar {
  height: 30px;
  width: 30px;
  padding-right: 5px;
  margin-left: 0px;
  margin-right: 0px;
}
.tribute-container ul {
  margin: 0;
  margin-top: 2px;
  padding: 0;
  list-style: none;
  background: #efefef;
}
.tribute-container li {
  padding: 5px 5px;
  cursor: pointer;
  display:flex;
}
.tribute-container li.highlight {
  background: #ddd;
}
.tribute-container li span {
  font-weight: bold;
}
.tribute-container li.no-match {
  cursor: default;
}
.tribute-container .menu-highlighted {
  font-weight: bold;
}
</style>    
  <script type='text/javascript' src="https://raw.githack.com/rojo2530/react-native-pell-rich-editor/master/src/tribute.js"></script>
</head>

<body>



<div class="content"><div tabindex="0" id="editor"  class="pell"></div></div>

<script>
    
    function mentions (users) {
      if (!users) {
        return null;
      }

      var tribute = new Tribute({
        // menuContainer: document.getElementById('content'),
        values: users,
        lookup: 'fullname',
      
        selectTemplate: function(item) {
          if (typeof item === "undefined") return null;
          if (this.range.isContentEditable(this.current.element)) {
            return (
              '<a id="user-mention" href="#" user-mentioned-id="' +
              item.original.user_id +
              '">' +
              item.original.fullname +
              "</a>"
            );
          }
      
          return "@" + item.original.value;
        },
        requireLeadingSpace: false
      });
      
      tribute.attach(document.getElementById("editor-content"));
    }

    (function (exports) {
        var defaultParagraphSeparatorString = 'defaultParagraphSeparator';
        var formatBlock = 'formatBlock';
        var addEventListener = function addEventListener(parent, type, listener) {
            return parent.addEventListener(type, listener);
        };
        var appendChild = function appendChild(parent, child) {
            return parent.appendChild(child);
        };
        var createElement = function createElement(tag) {
            return document.createElement(tag);
        };
        var queryCommandState = function queryCommandState(command) {
            return document.queryCommandState(command);
        };
        var queryCommandValue = function queryCommandValue(command) {
            return document.queryCommandValue(command);
        };

        var exec = function exec(command) {
            var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            return document.execCommand(command, false, value);
        };

        var postAction = function(data){
            window.ReactNativeWebView.postMessage(JSON.stringify(data));
        };

        var editor = null, o_height = 0;

        var Actions = {
            bold: {
                state: function() {
                    return queryCommandState('bold');
                },
                result: function() {
                    return exec('bold');
                }
            },
            italic: {
                state: function() {
                    return queryCommandState('italic');
                },
                result: function() {
                    return exec('italic');
                }
            },
            underline: {
                state: function() {

                    return queryCommandState('strikeThrough');
                },
                result: function() {
                    return exec('strikeThrough');
                }
            },
            strikethrough: {
              state: function() {
                return queryCommandState('strikeThrough');
              },
              result: function() {
                return exec('strikeThrough');
              }
            },
            heading1: {
                result: function() {
                    return exec(formatBlock, '<h1>');
                }
            },
            heading2: {
                result: function() {
                    return exec(formatBlock, '<h2>');
                }
            },
            paragraph: {
                result: function() {
                    return exec(formatBlock, '<p>');
                }
            },
            quote: {
                result: function() {
                    return exec(formatBlock, '<blockquote>');
                }
            },
            orderedList: {
                state: function() {
                    return queryCommandState('insertOrderedList');
                },
                result: function() {
                    return exec('insertOrderedList');
                }
            },
            unorderedList: {
                state: function() {
                    return queryCommandState('insertUnorderedList');
                },
                result: function() {
                    return exec('insertUnorderedList');
                }
            },
            code: {
                result: function() {
                    return exec(formatBlock, '<pre>');
                }
            },
            line: {
                result: function() {
                    return exec('insertHorizontalRule');
                }
            },
            link: {
                result: function() {
                    var url = window.prompt('Enter the link URL');
                    if (url) exec('createLink', url);
                }
            },
            image: {
                result: function(url) {
                  
                  console.time('Comienza...');
                    if (url) { exec('insertHTML', "<br><div><img src='"+ url +"'/></div><br>");}
                    console.time('Finaliza');
                    console.timeEnd('Finaliza');
                  }
            },
            content: {
                setHtml: function(html) {
                    editor.content.innerHTML += html;
                },

                setData: function(data) {
                  mentions(data);
                },
                
                getHtml: function() {
                    return editor.content.innerHTML;
                },
                blur: function() {
                    editor.content.blur();
                },
                focus: function() {
                    editor.content.focus();
                },
                postHtml: function (){
                    postAction({type: 'CONTENT_HTML_RESPONSE', data: editor.content.innerHTML});
                },
                setPlaceholder: function(placeholder){
                  editor.content.setAttribute("placeholder", placeholder)
                }
            },

            UPDATE_HEIGHT: function() {
                var height = Math.max(document.documentElement.clientHeight, document.documentElement.scrollHeight, document.body.clientHeight, document.body.scrollHeight);
                if (o_height !== height){
                    postAction({type: 'OFFSET_HEIGHT', data: o_height = height});
                }
            }
        };

        var init = function init(settings) {
            var defaultParagraphSeparator = settings[defaultParagraphSeparatorString] || 'div';

            var content = settings.element.content = createElement('div');
            content.contentEditable = true;
            content.spellcheck = false;
            content.autocapitalize = 'off';
            content.autocorrect = 'off';
            content.autocomplete = 'off';
            content.className = "pell-content";
            content.id="editor-content";
            content.oninput = function (_ref) {
                var firstChild = _ref.target.firstChild;

                if (firstChild && firstChild.nodeType === 3) exec(formatBlock, '<' + defaultParagraphSeparator + '>');else if (content.innerHTML === '<br>') content.innerHTML = '';
                settings.onChange(content.innerHTML);
            };
            content.onkeydown = function (event) {
                if (event.key === 'Enter' && queryCommandValue(formatBlock) === 'blockquote') {
                    setTimeout(function () {
                        return exec(formatBlock, '<' + defaultParagraphSeparator + '>');
                    }, 0);
                }
            };
            appendChild(settings.element, content);

            if (settings.styleWithCSS) exec('styleWithCSS');
            exec(defaultParagraphSeparatorString, defaultParagraphSeparator);

            var actionsHandler = [];
            for (var k in Actions){
                if (typeof Actions[k] === 'object' && Actions[k].state){
                    actionsHandler[k] = Actions[k]
                }
            }

            var handler = function handler() {

                var activeTools = [];
                for(var k in actionsHandler){
                    if ( Actions[k].state() ){
                        activeTools.push(k);
                    }
                }
                console.log('change', activeTools);
                postAction({type: 'SELECTION_CHANGE', data: activeTools});
                return true;
            };
            addEventListener(content, 'touchend', function(){
                setTimeout(handler, 100);
            });
            addEventListener(content, 'blur', function () {
                postAction({type: 'SELECTION_CHANGE', data: []});
            });
            addEventListener(content, 'focus', function () {
                postAction({type: 'CONTENT_FOCUSED'});
            });

            var message = function (event){
                var msgData = JSON.parse(event.data), action = Actions[msgData.type];
                if (action ){
                    if ( action[msgData.name]){
                        action[msgData.name](msgData.data);
                        if (msgData.name === 'result'){
                            content.focus();
                            handler();
                        }
                    } else {
                        action(msgData.data);
                    }
                }
            };

            document.addEventListener("message", message , false);
            window.addEventListener("message", message , false);
            document.addEventListener('touchend', function () {
                content.focus();
            });
            content.focus();
            return settings.element;
        };

        editor = init({
            element: document.getElementById('editor'),
            defaultParagraphSeparator: 'div',
        })

    })(window);


</script>
</body>
</html>
`;

export {HTML};
