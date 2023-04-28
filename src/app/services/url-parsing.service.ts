import { Injectable } from '@angular/core';
import { PRIMARY_OUTLET, Router, UrlSegmentGroup } from '@angular/router';
import { isParam } from '../utils/path-utils';

@Injectable({ providedIn: 'root' })
export class UrlParsingService {
  constructor(private router: Router) {}

  getPrimarySegments(url: string): string[] {
    const urlTree = this.router.parseUrl(url);
    return this._getPrimarySegmentsFromUrlTree(urlTree.root);
  }

  private _getPrimarySegmentsFromUrlTree(tree: UrlSegmentGroup): string[] {
    const segments = tree.segments.map((s) => s.path);
    const childrenSegments = tree.children[PRIMARY_OUTLET]
      ? this._getPrimarySegmentsFromUrlTree(tree.children[PRIMARY_OUTLET])
      : [];
    return segments.concat(childrenSegments);
  }

  matchPath(
    urlSegments: string | string[],
    pathSegments: string | string[]
  ): boolean {
    urlSegments = Array.isArray(urlSegments)
      ? urlSegments
      : this.getPrimarySegments(urlSegments);

    pathSegments = Array.isArray(pathSegments)
      ? pathSegments
      : this.getPrimarySegments(pathSegments);

    if (urlSegments.length !== pathSegments.length) {
      return false;
    }

    for (let i = 0; i < pathSegments.length; i++) {
      const pathSeg = pathSegments[i];
      const urlSeg = urlSegments[i];

      if (!isParam(pathSeg) && pathSeg !== urlSeg) {
        return false;
      }
    }
    return true;
  }
}
