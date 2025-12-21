
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Heart, Search, User, LogOut, Briefcase, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserRole } from "@/context/AuthContext";
import { VibeCheck } from "@/components/VibeCheck";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

const navLinks = [
  { name: "Vendors", href: "/vendors" },
  { name: "Venues", href: "/venues" },
  { name: "Planning Tips", href: "/tips" },
  { name: "Real Weddings", href: "/weddings" },
  { name: "Community Chat", href: "/community" },
];

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  // Filter nav links based on role
  const visibleNavLinks = navLinks.filter(link => {
    if (link.name === "Community Chat") {
      return user && (['couple', 'admin'] as UserRole[]).includes(user.role as UserRole);
    }
    return true;
  });

  const showPlanner = user && (['couple', 'admin'] as UserRole[]).includes(user.role as UserRole);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Mobile: Menu + Logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col">
                {/* Side Drawer Header */}
                <div className="p-4 border-b">
                  <h2 className="font-bold text-lg">Main menu</h2>
                </div>

                {/* Navigation Links with Chevrons */}
                <div className="flex-1 overflow-y-auto">
                  <nav className="flex flex-col">
                    {/* Planner link for logged-in couples/admins */}
                    {showPlanner && (
                      <SheetClose asChild>
                        <Link
                          to="/planner"
                          className="flex items-center justify-between px-4 py-4 border-b hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-medium">The Planner</span>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </Link>
                      </SheetClose>
                    )}

                    {/* My Style */}
                    <SheetClose asChild>
                      <Link
                        to="/style-matcher"
                        className="flex items-center justify-between px-4 py-4 border-b hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-medium">My Style</span>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </Link>
                    </SheetClose>

                    {/* Budget for logged-in users */}
                    {showPlanner && (
                      <SheetClose asChild>
                        <Link
                          to="/budget"
                          className="flex items-center justify-between px-4 py-4 border-b hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-medium">Budget Advisor</span>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </Link>
                      </SheetClose>
                    )}

                    {/* Main nav links */}
                    {visibleNavLinks.map((link) => (
                      <SheetClose asChild key={link.name}>
                        <Link
                          to={link.href}
                          className="flex items-center justify-between px-4 py-4 border-b hover:bg-slate-50 transition-colors"
                        >
                          <span className="font-medium">{link.name}</span>
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        </Link>
                      </SheetClose>
                    ))}
                  </nav>
                </div>

                {/* Drawer Footer - User section */}
                <div className="border-t p-4 bg-slate-50/50">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 pb-3 border-b">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatarUrl} alt={user?.fullName} className="object-cover" />
                          <AvatarFallback className="bg-rose-100 text-rose-800 font-bold">{user?.fullName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{user?.fullName}</p>
                          <p className="text-xs text-muted-foreground">{user?.email}</p>
                        </div>
                      </div>
                      <SheetClose asChild>
                        <Link to="/profile">
                          <Button variant="ghost" className="w-full justify-start gap-2" size="sm">
                            <User className="w-4 h-4" /> Settings
                          </Button>
                        </Link>
                      </SheetClose>
                      <Button
                        variant="ghost"
                        onClick={logout}
                        className="w-full justify-start gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                        size="sm"
                      >
                        <LogOut className="w-4 h-4" /> Log out
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <SheetClose asChild>
                        <Link to="/auth?mode=signin" className="flex-1">
                          <Button variant="outline" className="w-full" size="sm">Log in</Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/auth?mode=signup" className="flex-1">
                          <Button variant="champagne" className="w-full" size="sm">Sign up</Button>
                        </Link>
                      </SheetClose>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo next to menu button */}
            <Link to="/" className="flex items-center gap-1.5">
              <Heart className="w-5 h-5 text-rose-gold fill-rose-gold" />
              <span className="font-serif text-lg font-semibold text-foreground whitespace-nowrap">
                2Plan<span className="text-primary">A</span>Wedding
              </span>
            </Link>
          </div>

          {/* Desktop: Logo on left */}
          <Link to="/" className="hidden lg:flex items-center gap-2 mr-8">
            <Heart className="w-6 h-6 text-rose-gold fill-rose-gold" />
            <span className="font-serif text-xl md:text-2xl font-semibold text-foreground whitespace-nowrap">
              2Plan<span className="text-primary">A</span>Wedding
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-center">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Planner Mega Menu */}
                {showPlanner && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="bg-transparent">Planner</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                        <li className="row-span-3">
                          <NavigationMenuLink asChild>
                            <Link
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-rose-50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              to="/planner"
                            >
                              <Heart className="h-6 w-6 text-rose-gold mb-2" />
                              <div className="mb-2 mt-4 text-lg font-medium">
                                The Planner
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                Your central hub for style, budget, and matches.
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <Link to="/style-matcher" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">My Style Matcher</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Define your Florida vibe.</p>
                          </Link>
                        </li>
                        <li>
                          <Link to="/budget" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Budget Advisor</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Track spend & hidden fees.</p>
                          </Link>
                        </li>
                        <li>
                          <Link to="/vendors" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                            <div className="text-sm font-medium leading-none">Vendor Directory</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Find the perfect pros.</p>
                          </Link>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}

                {visibleNavLinks.map((link) => (
                  <NavigationMenuItem key={link.name}>
                    <Link to={link.href}>
                      <NavigationMenuLink className={navigationMenuTriggerStyle() + " bg-transparent"}>
                        {link.name}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile: Right side actions (Login/Signup or User) */}
          <div className="flex lg:hidden items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link to="/auth?mode=signin">
                  <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Log in</Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button variant="champagne" size="sm">Sign up</Button>
                </Link>
              </>
            ) : (
              <>
                <VibeCheck variant="header" />
                <Link to="/profile">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatarUrl} alt={user?.fullName} className="object-cover" />
                    <AvatarFallback className="text-sm">{user?.fullName?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon">
                  <Search className="w-5 h-5" />
                </Button>
                <Link to="/auth?mode=signin">
                  <Button variant="outline" className="gap-2">
                    <User className="w-4 h-4" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button variant="champagne">Join Free</Button>
                </Link>
              </>
            ) : (
              <>
                {/* Vibe Check - next to profile */}
                <VibeCheck variant="header" />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-fit rounded-full gap-2 px-2 hover:bg-rose-50">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatarUrl} alt={user?.fullName} className="object-cover" />
                        <AvatarFallback>{user?.fullName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm hidden xl:block">{user?.fullName?.split(" ")[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={user?.role === 'business' ? "/business" : "/planner"} className="cursor-pointer font-semibold">
                        <Briefcase className="mr-2 h-4 w-4" />
                        <span>{user?.role === 'business' ? "Business Hub" : "My Planner"}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
