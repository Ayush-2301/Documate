import { cn } from "@/lib/utils";
import { useOthers, useSelf } from "./../../liveblocks.config";
import styles from "./Avatars.module.css";

export function Avatars() {
  const users = useOthers();
  const currentUser = useSelf();

  return (
    <div className={styles.avatars}>
      {users.map(({ connectionId, info }) => {
        return (
          <Avatar key={connectionId} picture={info.picture} name={info.name} />
        );
      })}

      {currentUser && (
        <div className="relative ml-8 first:ml-0">
          <Avatar
            picture={currentUser.info.picture}
            name={currentUser.info.name}
            currentUser={true}
          />
        </div>
      )}
    </div>
  );
}

export function Avatar({
  picture,
  name,
  currentUser,
}: {
  picture: string;
  name: string;
  currentUser?: boolean;
}) {
  return (
    <div
      className={cn(
        styles.avatar,
        "!w-8 !h-8 rounded-full !bg-muted-foreground/30 !text-muted-foreground flex justify-center items-center !border-muted-foreground border before:bg-background hover:cursor-pointer",
        currentUser && "!text-foreground/70 !border-foreground/70"
      )}
      data-tooltip={name.split(" ")[0]}
    >
      <div data-tooltip={name}>{name[0]}</div>
    </div>
  );
}
