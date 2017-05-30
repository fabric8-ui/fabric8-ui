import { Component , ViewChild} from '@angular/core';
import { Comment, CommentAttributes } from '../../../../models/comment';
import { WorkItem } from '../../../../models/work-item';
import { WorkItemService } from '../../../work-item.service';

@Component({
  selector: 'fab-planner-delete-comment-modal',
  templateUrl: './comment-delete-modal.component.html',
  styleUrls: ['./comment-delete-modal.component.scss']
})
export class DeleteCommentModalComponent {

  @ViewChild('deleteCommentModal') deleteCommentModal: any;
  convictedComment: Comment;

  confirmCommentDelete(comment: Comment): void {
        this.deleteCommentModal.open();
        this.convictedComment = comment;
    }



    deleteComment(): void {
        this.workItemService
            .deleteComment(this.convictedComment)
            .subscribe(response => {
                if (response.status === 200) {
                    remove(this.workItem.relationships.comments.data, comment => {
                        if (!!this.convictedComment) {
                            return comment.id == this.convictedComment.id;
                        }
                    });
                }
            }, err => console.log(err));

        this.deleteCommentModal.close();
        this.createCommentObject();
    }
}
