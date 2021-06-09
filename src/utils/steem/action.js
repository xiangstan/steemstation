export function CalcReputation(reputation) {
  if (reputation == null) return reputation;
  reputation = parseInt(reputation);
  let rep = String(reputation);
  let neg = rep.charAt(0) === "-";
  rep = neg ? rep.substring(1) : rep;
  let leadingDigits = parseInt(rep.substring(0, 4));
  let log = Math.log(leadingDigits) / Math.log(10);
  let n = rep.length - 1;
  let out = n + (log - parseInt(log));
  if (isNaN(out)) out = 0;
  out = Math.max(out - 9, 0);
  out = (neg ? -1 : 1) * out;
  out = out * 9 + 25;
  out = +(Math.round(out + "e+" + 0)  + "e-" + 0);
  return out;
}

export function vote(voter, author, permlink, votes, callback) {
  const HasKeychain = (window.steem_keychain) ? true : false;
  if (HasKeychain) {
    // account, permlink, author, weight, callback, rpc
    window.steem_keychain.requestVote(voter, permlink, author, votes, (r) => {
      console.log(r);
      if (r.success) {
        callback(r);
      }
    });
  }
  else {
    callback({success: false, error: "no_keychain"});
  }
}
