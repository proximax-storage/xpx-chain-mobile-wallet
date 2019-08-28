import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalCacheProvider } from '../local-cache/local-cache';
import { Storage } from '@ionic/storage';


/*
  Generated class for the PostsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PostsProvider {

  seenPosts: Array<any> = [];


  constructor(public http: HttpClient, private cache: LocalCacheProvider, private storage: Storage) {
    console.log('Hello PostsProvider Provider');
    this.seenPosts

    this.getSeenPosts().then(posts=> {
			console.log("LOG: PostsProvider -> constructor -> posts", posts);
      this.seenPosts = posts || [];
    })
  }

  public getAll(): Observable<any> {
    let url = 'https://proximax-wallet-dashboard.herokuapp.com/posts?_sort=createdAt:DESC';
    return this.http.get(url);

    // let url = 'https://proximax-wallet-dashboard.herokuapp.com/posts';
    // let requestObservable = this.http.get(url);
    // return this.cache.observable('posts', requestObservable, 60*60) // 1 hour validity
  }

  public seenPost(postId): Promise<any> {
    this.seenPosts.push({ id: postId });
    return this.storage.get("seenPosts").then(seenPosts => {
      let posts: any[] = seenPosts;
      if (posts) {
        posts = posts.filter(_ => _.id != postId);
        posts.push({ id: postId });
          
      } else {
        posts = [{ id: postId }]; // Genesis post
      }
      return this.storage.set("seenPosts", posts);
    })

  }

  public getSeenPosts(): Promise<any> {
    return this.storage.get("seenPosts");
  }

  public getUnreadCount(): Promise<any> {
    return new Promise((resolve) => {
      this.getSeenPosts().then(seenPosts => {
        this.getAll().toPromise().then(async posts => {
          if (seenPosts) {
            resolve(posts.length - seenPosts.length);
          } else {
            resolve(posts.length);
          }
        })
      })
    })
  }

  public isNew(postId) {
      if (this.seenPosts) {
        let posts = this.seenPosts.filter(_ => _.id === postId);
				console.log("LOG: PostsProvider -> publicisNew -> posts", posts);
        if(posts.length > 0) {
          return true;
        } else {
          return false;
        } 
      } else {
        return false;
      }
  }
}