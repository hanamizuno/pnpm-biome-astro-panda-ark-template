import { Menu } from "@ark-ui/react/menu";
import { useEffect, useState } from "react";
import { css } from "../../styled-system/css";
import {
  applyTheme,
  getThemeFromLocalStorage,
  setThemeToLocalStorage,
  type Theme,
} from "../utils/theme";

export default function ThemeMenu() {
  const [mode, setMode] = useState<Theme>("system");

  useEffect(() => {
    const saved = getThemeFromLocalStorage();
    setMode(saved);
    applyTheme(saved);
  }, []);

  // システムテーマの変更に追従
  useEffect(() => {
    if (mode !== "system") return;
    const mql = globalThis.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mode]);

  const onPick = (next: Theme) => {
    setMode(next);
    setThemeToLocalStorage(next);
    applyTheme(next);
  };

  const getIcon = () => {
    if (mode === "system") return "🌓";
    return mode === "dark" ? "🌙" : "☀️";
  };

  const getLabel = () => {
    if (mode === "system") return "システム";
    return mode === "dark" ? "ダーク" : "ライト";
  };

  return (
    <Menu.Root>
      <Menu.Trigger
        className={css({
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1",
          padding: "2",
          borderRadius: "md",
          backgroundColor: "transparent",
          border: "1px solid",
          borderColor: "border",
          cursor: "pointer",
          transition: "all 0.2s",
          fontSize: "sm",
          minWidth: "100px",
          _hover: {
            backgroundColor: "muted",
          },
        })}
        aria-label="カラーモード切り替え"
      >
        <span className={css({ fontSize: "lg" })}>{getIcon()}</span>
        <span className={css({ fontWeight: "medium" })}>{getLabel()}</span>
        <span className={css({ marginLeft: "1", fontSize: "xs" })}>▼</span>
      </Menu.Trigger>

      <Menu.Positioner>
        <Menu.Content
          className={css({
            minWidth: "140px",
            backgroundColor: "card",
            border: "1px solid",
            borderColor: "border",
            borderRadius: "md",
            padding: "1",
            boxShadow: "lg",
            zIndex: "50",
          })}
        >
          <Menu.RadioItemGroup value={mode} onValueChange={(e) => onPick(e.value as Theme)}>
            <Menu.RadioItem
              value="light"
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "2",
                padding: "2",
                borderRadius: "sm",
                cursor: "pointer",
                transition: "background 0.15s",
                _hover: {
                  backgroundColor: "muted",
                },
                _highlighted: {
                  backgroundColor: "muted",
                },
              })}
            >
              <Menu.ItemIndicator
                className={css({
                  width: "4",
                  height: "4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                })}
              >
                ✓
              </Menu.ItemIndicator>
              <span className={css({ fontSize: "lg" })}>☀️</span>
              <Menu.ItemText className={css({ fontSize: "sm" })}>ライト</Menu.ItemText>
            </Menu.RadioItem>

            <Menu.RadioItem
              value="dark"
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "2",
                padding: "2",
                borderRadius: "sm",
                cursor: "pointer",
                transition: "background 0.15s",
                _hover: {
                  backgroundColor: "muted",
                },
                _highlighted: {
                  backgroundColor: "muted",
                },
              })}
            >
              <Menu.ItemIndicator
                className={css({
                  width: "4",
                  height: "4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                })}
              >
                ✓
              </Menu.ItemIndicator>
              <span className={css({ fontSize: "lg" })}>🌙</span>
              <Menu.ItemText className={css({ fontSize: "sm" })}>ダーク</Menu.ItemText>
            </Menu.RadioItem>

            <Menu.RadioItem
              value="system"
              className={css({
                display: "flex",
                alignItems: "center",
                gap: "2",
                padding: "2",
                borderRadius: "sm",
                cursor: "pointer",
                transition: "background 0.15s",
                _hover: {
                  backgroundColor: "muted",
                },
                _highlighted: {
                  backgroundColor: "muted",
                },
              })}
            >
              <Menu.ItemIndicator
                className={css({
                  width: "4",
                  height: "4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                })}
              >
                ✓
              </Menu.ItemIndicator>
              <span className={css({ fontSize: "lg" })}>🌓</span>
              <Menu.ItemText className={css({ fontSize: "sm" })}>システム</Menu.ItemText>
            </Menu.RadioItem>
          </Menu.RadioItemGroup>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
