import { Grid, Link, Typography } from '@mui/material'
import { nanoid } from 'nanoid'
import { useDispatch, useSelector } from 'react-redux'
import { getBaseWowheadUrl } from '../Common'
import { Glyphs } from '../data/Glyphs'
import i18n from '../i18n/config'
import { setGlyphSlotId } from '../redux/PlayerSlice'
import { RootState } from '../redux/Store'
import {
  setGlyphSelectionTableGlyphSlot,
  setGlyphSelectionTableVisibility,
} from '../redux/UiSlice'
import { GlyphId, GlyphType } from '../Types'

function Glyph(glyphId: GlyphId | undefined, glyphSlot: number) {
  const dispatch = useDispatch()
  const glyph = Glyphs.find(x => x.Id === glyphId)

  return (
    <Grid
      item
      xs={4}
      key={nanoid()}
      onClick={e => {
        dispatch(setGlyphSelectionTableVisibility(true))
        dispatch(setGlyphSelectionTableGlyphSlot(glyphSlot))
        e.preventDefault()
        e.stopPropagation()
      }}
      onContextMenu={e => {
        dispatch(setGlyphSlotId({ slot: glyphSlot, id: undefined }))
        e.preventDefault()
      }}
    >
      <Link
        target='_blank'
        rel='noreferrer'
        href={
          glyphId !== null
            ? `${getBaseWowheadUrl(i18n.language)}/item=${glyphId}`
            : ''
        }
        style={{ display: 'block', height: '100%' }}
      >
        <Grid
          item
          xs={2}
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            height: '100%',
          }}
        >
          <img
            width={32}
            height={32}
            alt={'Glyph Slot'}
            src={`${process.env.PUBLIC_URL}/img/${
              glyphId != null ? glyph?.IconName : 'inventoryslot_empty'
            }.jpg`}
          />
        </Grid>
        <Grid item xs={10} style={{ display: 'inline-block' }}>
          <Typography
            style={{
              display: 'inline-block',
              marginLeft: '10px',
              color: 'white',
            }}
          >
            {glyph?.Name || 'Empty'}
          </Typography>
        </Grid>
      </Link>
    </Grid>
  )
}

export default function GlyphSelection() {
  const player = useSelector((state: RootState) => state.player)

  return (
    <Grid container style={{ paddingLeft: '3px' }}>
      <fieldset>
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
