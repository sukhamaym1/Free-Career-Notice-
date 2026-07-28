const fs = require('fs');

let contentStr = fs.readFileSync('src/admin/pages/EditorPage.tsx', 'utf8');

const targetStr = `              <RichTextEditor 
                isFocusMode={isFocusMode}
                content={editingPost?.content || ''} 
                onChange={(html) => {
                  const input = document.getElementById("hidden-content-input") as HTMLTextAreaElement;
                  if (input) {
                    input.value = html;
                  }
                }}
              />
            </div>
            <textarea 
              name="content" 
              id="hidden-content-input" 
              className="hidden" 
              defaultValue={editingPost?.content || ''}
            ></textarea>`;

const replacementStr = `              <RichTextEditor 
                isFocusMode={isFocusMode}
                content={content} 
                onChange={setContent}
              />
            </div>
            <input type="hidden" name="content" value={content} />`;

if (contentStr.includes(targetStr)) {
  contentStr = contentStr.replace(targetStr, replacementStr);
  fs.writeFileSync('src/admin/pages/EditorPage.tsx', contentStr);
  console.log('Replaced successfully');
} else {
  console.log('Target string not found!');
  // Let's print out the actual block to see why it doesn't match
  console.log(contentStr.substring(contentStr.indexOf('<RichTextEditor'), contentStr.indexOf('></textarea>') + 12));
}

