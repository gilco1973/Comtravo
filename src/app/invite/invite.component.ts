import {Component, OnDestroy, OnInit} from '@angular/core';
import {InviteService, User} from '../service/invite.service';
import {of, Subscription} from 'rxjs';
import {catchError, concatMap} from 'rxjs/operators';
import {Router} from '@angular/router';

let users: User[] = [
    {email: 'user0@comtravo.com'},
    {email: 'user1@comtravo.com'},
    {email: 'user2@comtravo.com'},
    {email: 'user3@comtravo.com'},
    {email: 'user4@comtravo.com'},
    {email: 'user5@comtravo.com'},
    {email: 'user6@comtravo.com'},
    {email: 'user7@comtravo.com'},
    {email: 'user8@comtravo.com'},
    {email: 'user9@comtravo.com'},
    {email: 'user10@comtravo.com'}
];

@Component({
    selector: 'app-invite',
    templateUrl: './invite.component.html',
    styleUrls: ['./invite.component.css']
})
export class InviteComponent implements OnInit, OnDestroy {

    constructor(private inviteService: InviteService, private router: Router) {
    }

    private subscription: Subscription;

    private showErrorMsg(user: User, err: any) {
        switch (err.status) { // Use different messages for each error code type
            case 409:
                alert(`User ${user.email} already received an invitation, skipping.`);
                break;
            case 500:
                alert(`Skipping ${user.email}. An internal server error occurred.`);
                break;
            default: // Unexpected error code, general failure message
                alert(`Skipping ${user.email}. An error occurred.`);
                break;
        }
    }

    ngOnInit(): void {
        // OPTIONAL - Check that we filter out users that are already saved in our db as users that received the invitation, so we don't invite them again.
        // this.inviteService.get().subscribe((existingUsers: User[]) => {
        //     users = this.getFilteredUsers(existingUsers) || users;
        // });
    }

    onSubmit(): void {
        let successfulCounter = 0;
        this.subscription = of(...users).pipe(
            concatMap((user: User) => { // run each http call sequentially
                return this.inviteService.invite(user)
                    .pipe(catchError(err => {
                        this.showErrorMsg(user, err); // Error handling
                        return of(err); // return an observable so we don't get stuck on error
                    }));
            }))
            .subscribe((result) => {
                console.log(result);
                if (result && !result.error) { // I wanted to use: !result?.error, but the typescript version in this project is 3.1.1,
                    // typescript version 3.7.2 and above supports optional chaining
                    successfulCounter++; // Make sure it's not an error and add to the successful calls counter
                }
            }, error => { // We already catch errors in the http call response itself
            }, () => {
                this.router.navigateByUrl(`/`);
                alert(`A total of ${successfulCounter} invitations were sent.`);
            });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe(); // Always unsubscribe when component is destroyed
        }
    }

    private getFilteredUsers(existingUsers: User[]): User[] {
        const existingUsersEmails = existingUsers.map((existingUser: User) => existingUser.email);
        return users.filter((el: User) => {
            return !existingUsersEmails.includes(el.email);
        });
    }
}
