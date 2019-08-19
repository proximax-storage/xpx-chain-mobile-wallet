import { Injectable } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

import { SimpleWallet } from 'nem-library';
import { AlertProvider } from '../alert/alert';

/*
  Generated class for the FilePickerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FilePickerProvider {
  constructor(
    private fileChooser: FileChooser,
    private filePath: FilePath,
    private file: File,
    private alertProvider: AlertProvider,
  ) {
    console.log('Hello FilePickerProvider Provider');
  }

  /**
   * Opens a file picker and accepts file with extension of wlt. (Android only)
   */
  open(): Promise<any> {
    // 0. Open file picker.
    return this.fileChooser
      .open()
      .then(result => {
        // 1. Get path via URI.
        return this.filePath.resolveNativePath(result);
      })
      .then(result => {
        // 2. Get native path based on platform like ios and android.
        return this.file.resolveLocalFilesystemUrl(result);
      })
      .then(result => {
        // 3.1 Get file name and encode it.
        const fileName = encodeURI(result.name);

        // 3.2 Remove encoded file name in full native URL.
        const dir = result.nativeURL.replace(fileName, '');

        // 4. Return empty string if the the file extension is now wlt.
        if (fileName.indexOf('.wlt') === -1) {
          this.alertProvider.showMessage('The wallet file must have a .wlt extension type');
          return '';
        }

        // 5. Read contents of the wlt file.
        return this.file.readAsText(dir, result.name);
      })
      .then(result => {
        // 6. Exit promise if the content of the file is null or empty.
        if (!result) return;

        // 7. Return SimpleWallet from the nanowallet file.
        return SimpleWallet.readFromNanoWalletWLF(result);
      })
      .catch(e => {
        // Handle errors
        // | Code | Constant                      |
        // |-----:|:------------------------------|
        // |    1 | `NOT_FOUND_ERR`               |
        // |    2 | `SECURITY_ERR`                |
        // |    3 | `ABORT_ERR`                   |
        // |    4 | `NOT_READABLE_ERR`            |
        // |    5 | `ENCODING_ERR`                |
        // |    6 | `NO_MODIFICATION_ALLOWED_ERR` |
        // |    7 | `INVALID_STATE_ERR`           |
        // |    8 | `SYNTAX_ERR`                  |
        // |    9 | `INVALID_MODIFICATION_ERR`    |
        // |   10 | `QUOTA_EXCEEDED_ERR`          |
        // |   11 | `TYPE_MISMATCH_ERR`           |
        // |   12 | `PATH_EXISTS_ERR`             |

        console.log(e);
      });
  }
}
