import React from 'react'
import { MarkdownPreview } from 'react-marked-markdown';

const PreviewMarked = ({content}) => {
    return (
            <div> 
              <MarkdownPreview value={content }/>
            </div>
    )
}

export default PreviewMarked;
