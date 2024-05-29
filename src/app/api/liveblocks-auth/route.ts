import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
/**
 * Authenticating your Liveblocks application
 * https://liveblocks.io/docs/authentication
 */

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

export async function POST(request: NextRequest) {
  const supabase = supabaseServer();
  const { data, error } = await supabase.auth.getUser();

  // Get the current user's unique id from your database
  const userId = data.user?.id;

  // Create a session for the current user
  // userInfo is made available in Liveblocks presence hooks, e.g. useOthers
  if (userId) {
    const session = liveblocks.prepareSession(`user-${userId}`, {
      userInfo: {
        name: data.user?.user_metadata.full_name,
        color: "#D583F0",
        picture: data.user?.user_metadata.avatar_url,
      },
    });

    // Use a naming pattern to allow access to rooms with a wildcard
    session.allow(`${userId}:*`, session.FULL_ACCESS);

    // Authorize the user and return the result
    const { body, status } = await session.authorize();
    return new Response(body, { status });
    // const { status, body } = await liveblocks.identifyUser(
    //   {
    //     userId: userId,
    //     groupIds: ["documents"],
    //   },
    //   {
    //     userInfo: {
    //       name: data.user?.user_metadata.full_name,
    //       color: "#D583F0",
    //       picture: data.user?.user_metadata.avatar_url,
    //     },
    //   }
    // );

    // return new Response(body, { status });
  }
}

// const USER_INFO = [
//   {
//     name: "Charlie Layne",
//     color: "#D583F0",
//     picture: "https://liveblocks.io/avatars/avatar-1.png",
//   },
//   {
//     name: "Mislav Abha",
//     color: "#F08385",
//     picture: "https://liveblocks.io/avatars/avatar-2.png",
//   },
//   {
//     name: "Tatum Paolo",
//     color: "#F0D885",
//     picture: "https://liveblocks.io/avatars/avatar-3.png",
//   },
//   {
//     name: "Anjali Wanda",
//     color: "#85EED6",
//     picture: "https://liveblocks.io/avatars/avatar-4.png",
//   },
//   {
//     name: "Jody Hekla",
//     color: "#85BBF0",
//     picture: "https://liveblocks.io/avatars/avatar-5.png",
//   },
//   {
//     name: "Emil Joyce",
//     color: "#8594F0",
//     picture: "https://liveblocks.io/avatars/avatar-6.png",
//   },
//   {
//     name: "Jory Quispe",
//     color: "#85DBF0",
//     picture: "https://liveblocks.io/avatars/avatar-7.png",
//   },
//   {
//     name: "Quinn Elton",
//     color: "#87EE85",
//     picture: "https://liveblocks.io/avatars/avatar-8.png",
//   },
// ];
