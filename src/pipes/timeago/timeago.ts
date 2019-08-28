import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";

/**
 * Generated class for the TimeagoPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: "timeago"
})
export class TimeagoPipe implements PipeTransform {
  /**
   * Takes a value of date and makes it relative time or timeago.
   */
  transform(value: string, ...args) {
    return moment(value).fromNow();
  }
}
