import { Grid, Link, Typography } from '@mui/material'
import { nanoid } from 'nanoid'
import { useDispatch, useSelector } from 'react-redux'
import { GetBaseWowheadUrl } from '../Common'
import { Glyphs } from '../data/Glyphs'
import i18n from '../i18n/config'
import { SetGlyphSlotId } from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import {
  SetGlyphSelectionTableGlyphSlot,
  SetGlyphSelectionTableVisibility,
} from '../redux/UiSlice'
import { GlyphId, GlyphType } from '../Types'

export default function GlyphSelection() {
  const player = useSelector((state: RootState) => state.player)

  return (
    <Grid container style={{ paddingLeft: '3px' }}>
      <fieldset style={{ width: '100%' }}>
        <legend>
          <Typography>Glyphs</Typography>
        </legend>
        <Grid container justifyContent='space-between'>
          {player.Glyphs[GlyphType.Major].map((glyphId, glyphSlot) =>
            Glyph(glyphId, glyphSlot)
          )}
        </Grid>
      </fieldset>
    </Grid>
  )
}

function Glyph(glyphId: GlyphId | undefined, glyphSlot: number) {
  const dispatch = useDispatch()
  const glyph = Glyphs.find(x => x.Id === glyphId)

  return (
    <Grid
      item
      xs={4}
      key={nanoid()}
      onClick={e => {
        dispatch(SetGlyphSelectionTableVisibility(true))
        dispatch(SetGlyphSelectionTableGlyphSlot(glyphSlot))
        e.preventDefault()
        e.stopPropagation()
      }}
      onContextMenu={e => {
        dispatch(SetGlyphSlotId({ slot: glyphSlot, id: undefined }))
        e.preventDefault()
      }}
    >
      <Link
        target='_blank'
        rel='noreferrer'
        href={
          glyphId !== null
            ? `${GetBaseWowheadUrl(i18n.language)}/spell=${glyphId}`
            : ''
        }
      >
        <Grid container>
          <img
            width={32}
            height={32}
            alt={'Glyph Slot'}
            src={`${process.env.PUBLIC_URL}/img/${
              glyphId != null ? glyph?.IconName : 'inventoryslot_empty'
            }.jpg`}
          />
          <Typography
            noWrap
            paragraph
            style={{ color: 'white', marginLeft: '5px', maxWidth: '75%' }}
          >
            {glyph?.Name || 'Empty'}
          </Typography>
        </Grid>
      </Link>
    </Grid>
  )
}
