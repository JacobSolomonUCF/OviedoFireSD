package comtelekpsi.github.oviedofireandroid;

import android.content.Context;
import android.view.Gravity;
import android.widget.RadioButton;
import android.widget.RelativeLayout;
import android.widget.TableRow;
import android.widget.TextView;

/**
 * Created by David on 10/28/2017.
 */

public class FancyRadioGroupTablet {
    public FancyRadioGroupTablet(Context context, TableRow tableRow, TextView textView, RadioButton pButton, RadioButton mButton, RadioButton rButton){
        TableRow.LayoutParams rowParams= new TableRow.LayoutParams(TableRow.LayoutParams.MATCH_PARENT, TableRow.LayoutParams.MATCH_PARENT, 1.0f);
        textView.setLayoutParams(rowParams);

        RelativeLayout relativeLayout = new RelativeLayout(context);
        tableRow.addView(relativeLayout);
        relativeLayout.setLayoutParams(rowParams);
        relativeLayout.setGravity(Gravity.RIGHT);

        relativeLayout.addView(pButton);
        relativeLayout.addView(mButton);
        relativeLayout.addView(rButton);

        RelativeLayout.LayoutParams topLParams= new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        pButton.setLayoutParams(topLParams);

        RelativeLayout.LayoutParams topRParams= new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        topRParams.addRule(RelativeLayout.RIGHT_OF,pButton.getId());
        mButton.setLayoutParams(topRParams);

        RelativeLayout.LayoutParams botParams= new RelativeLayout.LayoutParams(RelativeLayout.LayoutParams.WRAP_CONTENT, RelativeLayout.LayoutParams.WRAP_CONTENT);
        botParams.addRule(RelativeLayout.RIGHT_OF,mButton.getId());
        rButton.setLayoutParams(botParams);
    }
}
