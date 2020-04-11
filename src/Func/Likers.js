export default class MngLikers {
  isLiker(steemId, likers) {
    for (let i = 0; i < likers.length; i++) {
      if (steemId === likers[i]) {
        return true;
      }
    }
    return false;
  }
}
