
import { TestBed } from '@angular/core/testing';
import { CommentComponent } from './comment.component';
import { CommentUI } from '../../models/comment';

describe('Unit Test :: Testing comment module', () => {
  it('should emit event on show preview', () => {
    const comp = new CommentComponent();
    const showPreviewInput = {
      rawText: 'some text',
      callBack: (a, b) => {}
    };
    comp.onPreview.subscribe(item => {
      expect(item.rawText)
        .toBe(
          showPreviewInput.rawText, 'Emits the correct rawtext'
        );
    })
    comp.showPreview(showPreviewInput);
  });

  it('should emit event on showPreview', () => {
    const comp = new CommentComponent();
    const showPreviewInput = {
      rawText: 'some text',
      callBack: (a, b) => {}
    };
    comp.onPreview.subscribe(item => {
      expect(item.rawText)
        .toBe(
          showPreviewInput.rawText, 'Emits the correct rawtext'
        );
    })
    comp.showPreview(showPreviewInput);
  });

  it('should emit event on createComment', () => {
    const comp = new CommentComponent();
    comp.comment = {
      id: 'comment-1'
    } as CommentUI;
    const createCommentInput = {
      rawText: 'some text',
      callBack: (a, b) => {}
    };
    comp.onCreateRequest.subscribe(item => {
      expect(item.body)
        .toBe(
          createCommentInput.rawText, 'Emits the correct body'
        );
      expect(item.parentId)
        .toBe(
          'comment-1', 'Emits the correct parentId'
        );
    })
    comp.createComment(createCommentInput);
  });

  it('should emit event on updateComment', () => {
    const comp = new CommentComponent();
    const comment = {
      id: 'comment-1',
      selfLink: 'http://linkto'
    } as CommentUI;
    const updateCommentInput = {
      rawText: 'some text',
      callBack: (a, b) => {}
    };

    comp.onUpdateRequest.subscribe(item => {
      expect(item.body)
        .toBe(
          updateCommentInput.rawText, 'Emits the correct body'
        );
      expect(item.id)
        .toBe(
          'comment-1', 'Emits the correct parentId'
        );
    })
    comp.updateComment(updateCommentInput, comment);
  });
});
