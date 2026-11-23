'use client';

import { sanitizeUrl } from '@/features/tiptap/lib/tiptapUtils';
import {
  getEmbedUrlFromYoutubeUrl,
  YoutubeOptions,
} from '@tiptap/extension-youtube';
import { Node } from '@tiptap/pm/model';
import {
  mergeAttributes,
  NodeViewWrapper,
  type NodeViewProps,
} from '@tiptap/react';
import { useCallback, useState } from 'react';
import { BsGearFill } from 'react-icons/bs';
import { Button } from '../../ui-primitive/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../ui-primitive/Popover';
import {
  SetYoutubeVideoOptions,
  YOUTUBE_DEFAULT_SIZE,
  YoutubeMain,
} from '../../ui/YoutubePopover';
import './YoutubeNode.scss';

type Props = NodeViewProps & {
  options: YoutubeOptions;
};

/**
 * Youtubeメイン（設定編集機能付き）
 */
export const YoutubeNode = ({
  editor,
  node,
  updateAttributes,
  options,
  HTMLAttributes,
}: Props) => {
  const syncHTMLAttribute = ({
    src,
    width,
    height,
    start,
  }: SetYoutubeVideoOptions) => {
    const embedUrl = getEmbedUrlFromYoutubeUrl({
      url: src,
      allowFullscreen: options.allowFullscreen,
      autoplay: options.autoplay,
      ccLanguage: options.ccLanguage,
      ccLoadPolicy: options.ccLoadPolicy,
      controls: options.controls,
      disableKBcontrols: options.disableKBcontrols,
      enableIFrameApi: options.enableIFrameApi,
      endTime: options.endTime,
      interfaceLanguage: options.interfaceLanguage,
      ivLoadPolicy: options.ivLoadPolicy,
      loop: options.loop,
      modestBranding: options.modestBranding,
      nocookie: options.nocookie,
      origin: options.origin,
      playlist: options.playlist,
      progressBarColor: options.progressBarColor,
      startAt: node.attrs.start || 0,
      rel: options.rel,
    });
    HTMLAttributes.src = embedUrl;
    HTMLAttributes.width = width ?? HTMLAttributes.width;
    HTMLAttributes.height = height ?? HTMLAttributes.height;
    HTMLAttributes.start = start ?? HTMLAttributes.start;
  };

  syncHTMLAttribute({ src: node.attrs.src });

  return (
    <NodeViewWrapper className="youtube-node" contentEditable={false}>
      {editor.isEditable && (
        <EditYoutubeConfig
          node={node}
          updateAttributes={updateAttributes}
          syncHTMLAttribute={syncHTMLAttribute}
        />
      )}
      <div className="youtube-preview">
        <iframe
          {...mergeAttributes(
            options.HTMLAttributes,
            {
              width: options.width,
              height: options.height,
              allowFullScreen: options.allowFullscreen,
              autoPlay: options.autoplay,
              cclanguage: options.ccLanguage,
              ccloadpolicy: options.ccLoadPolicy,
              disablekbcontrols: options.disableKBcontrols,
              enableiframeapi: options.enableIFrameApi,
              endtime: options.endTime,
              interfacelanguage: options.interfaceLanguage,
              ivloadpolicy: options.ivLoadPolicy,
              loop: options.loop,
              modestbranding: options.modestBranding,
              origin: options.origin,
              playlist: options.playlist,
              progressbarcolor: options.progressBarColor,
              rel: options.rel,
            },
            HTMLAttributes
          )}
        />
      </div>
    </NodeViewWrapper>
  );
};

/**
 * Youtube設定編集用ポップオーバー
 */
const EditYoutubeConfig = ({
  node,
  updateAttributes,
  syncHTMLAttribute,
}: {
  node: Node;
  updateAttributes: (attributes: Record<string, any>) => void;
  syncHTMLAttribute: (attributes: SetYoutubeVideoOptions) => void;
}) => {
  const [youtubeState, setYoutubeState] =
    useState<SetYoutubeVideoOptions | null>(null);

  const handleEdit = () => {
    setYoutubeState({
      src: node.attrs.src ?? '',
      width: node.attrs.width ?? YOUTUBE_DEFAULT_SIZE.width,
      height: node.attrs.height ?? YOUTUBE_DEFAULT_SIZE.height,
      start: node.attrs.start ?? 0,
    });
  };

  const handleSave = () => {
    if (!youtubeState?.src.trim()) return;

    updateAttributes(youtubeState);
    syncHTMLAttribute(youtubeState);
    setYoutubeState(null);
  };

  const openYoutube = useCallback(() => {
    if (!youtubeState?.src) return;

    const safeUrl = sanitizeUrl(youtubeState.src, window.location.href);
    window.open(safeUrl, '_blank', 'noopener,noreferrer');
  }, [youtubeState?.src]);

  return (
    <Popover onOpenChange={handleEdit}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="tiptap-youtube-node__config-button">
          <BsGearFill />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <YoutubeMain
          youtubeState={
            youtubeState ?? {
              src: node.attrs.src ?? '',
              width: node.attrs.width ?? YOUTUBE_DEFAULT_SIZE.width,
              height: node.attrs.height ?? YOUTUBE_DEFAULT_SIZE.height,
              start: node.attrs.start ?? 0,
            }
          }
          setYoutubeState={setYoutubeState}
          setYoutube={handleSave}
          openYoutube={openYoutube}
          isActive={true}
        />
      </PopoverContent>
    </Popover>
  );
};
