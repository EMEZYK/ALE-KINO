import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { of, tap } from "rxjs";
import { AuthStateService } from "./auth.service";

export const AuthGuard: CanActivateFn = () => {
    const router = inject (Router);


    return of(true).pipe(
        tap((canActivate) => {
            if (!canActivate)
            console.log('przekierowało')
            router.navigate([''])
        })
    )
}

