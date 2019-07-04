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
  posts:Array<any>=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private articles: PostsProvider) {

    this.articles.getAll().subscribe(posts=> {
      console.log("Blog posts", posts);
      this.posts = posts;
    })
   

    this.articles.getUnreadCount().then(res => {
      console.log("Unread count", res);
    })

  }

  doRefresh(refresher) {
    setTimeout(() => {
      console.log('Async operation has ended');

      this.articles.getAll().subscribe(posts=> {
        console.log("Blog posts", posts);
        this.posts = posts;
      })

      refresher.complete();
    }, 2000);
  }

 seenPost(postId) {
    console.log('post id', postId)
    this.articles.seenPost(postId).then(res=> {
      console.log("seenPosts", res);
      this.getAllSeenPosts();
      this.articles.getUnreadCount().then(res  => {
        console.log("Unread count", res); 
      })


    })
  }

  getAllSeenPosts(){
    this.articles.getSeenPosts().then(res=> {
      console.log("getAllSeenPosts", res);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  showMore(post){

    this.posts.map((_post) => {

        if(post._id == _post._id){
            _post.expanded = !_post.expanded;
        } else {
            _post.expanded = false;
        }

        return _post;

    });

  } 

  isNew(postId) {
    if(!this.articles.isNew(postId)) {
      return "New"
    } else {
      return ''
    }
  }

}
