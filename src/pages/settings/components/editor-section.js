import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import React, { useRef } from 'react';
import { useFormik } from 'formik';
import Editor from './froala-editor';

const EditorSection = () => {
  const quillRef = useRef();

  const formik = useFormik({
    initialValues: {
      template: '',
    },
    onSubmit: values => {
      console.log(values);
    },
  });

  const handleTemplateChange = value => {
    formik.setFieldValue('template', value);
  };

  return (
    <Stack direction="column" spacing={2} mt={2}>
      <form onSubmit={formik.handleSubmit}>
        <Typography component="h2" variant="h5">
          Editor de plantillas
        </Typography>
        <Editor ref={quillRef} />

        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Guardar
        </Button>
      </form>
    </Stack>
  );
};

export default EditorSection;
