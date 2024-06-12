import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/plugins/colors.min.css';
import 'froala-editor/css/plugins/quick_insert.min.css';
import dynamic from 'next/dynamic';
import { Box } from '@mui/system';
import { EmailTemplate } from 'src/utils/email-template';
const FroalaEditorComponent = dynamic(
  () => {
    import('froala-editor/js/plugins.pkgd.min.js');
    import('froala-editor/js/plugins/align.min.js');
    import('froala-editor/js/plugins/lists.min.js');
    import('froala-editor/js/plugins/image.min.js');
    import('froala-editor/js/plugins/quick_insert.min.js');
    import('froala-editor/js/plugins/colors.min.js');
    import('froala-editor/js/plugins/font_size.min.js');
    import('froala-editor/js/plugins/font_family.min.js');

    return import('react-froala-wysiwyg');
  },
  {
    ssr: false,
  },
);

function Editor() {
  return (
    <Box mt={2} component="section">
      <FroalaEditorComponent
        tag="textarea"
        model={EmailTemplate}
        config={{
          pluginsEnabled: [
            'align',
            'lists',
            'image',
            'colors',
            'link',
            'fontSize',
            'fontFamily',
          ],
          placeholderText: 'Escribe aquí tu plantilla de correo...',
          listAdvancedTypes: true,
          toolbarButtons: [
            ['bold', 'italic', 'underline', 'strikeThrough', '|'],
            ['fontSize', 'fontFamily', 'textColor', 'backgroundColor', '|'],
            ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', '|'],
            ['formatOL', 'formatUL', 'outdent', 'indent', '|'],
            ['insertImage', 'insertLink', '|'],
            ['undo', 'redo'],
          ],
        }}
      />
    </Box>
  );
}

export default Editor;
