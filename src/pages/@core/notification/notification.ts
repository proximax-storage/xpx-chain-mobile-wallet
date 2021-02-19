import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PostsProvider } from '../../../providers/posts/posts';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  posts: Array<any> = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private articles: PostsProvider) {

    this.articles.getAll().subscribe(posts => {
      this.posts = posts;
    })


    this.articles.getUnreadCount().then(res => {
    })

  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.articles.getAll().subscribe(posts => {
        this.posts = posts;
      })

      refresher.complete();
    }, 2000);
  }

  seenPost(postId) {
    this.articles.seenPost(postId).then(res => {
      this.getAllSeenPosts();
      this.articles.getUnreadCount().then(res => {
      })
    })
  }

  getAllSeenPosts() {
    this.articles.getSeenPosts().then(res => {
    });
  }

  ionViewDidLoad() {
  }

  showMore(post) {
    this.posts.map((_post) => {
      if (post._id == _post._id) {
        _post.expanded = !_post.expanded;
      } else {
        _post.expanded = false;
      }

      return _post;
    });

  }

  isNew(postId) {
    if (!this.articles.isNew(postId)) {
      return "New"
    } else {
      return ''
    }
  }

}
